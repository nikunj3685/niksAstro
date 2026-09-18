import { AfterViewInit, Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CAMERAS, TELESCOPES } from './fov-data';

interface FovResult {
  widthDeg: number;
  heightDeg: number;
  pixelScaleArcsecPerPixel: number;
}

interface OverlapDeg {
  widthDeg: number;
  heightDeg: number;
}

@Component({
  selector: 'app-aladin',
  imports: [FormsModule],
  templateUrl: './aladin.html',
  styleUrl: './aladin.css'
})
export class Aladin implements AfterViewInit {
  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('aladinContainer');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('fovPanel');
  private readonly panelToggleBtn = viewChild<ElementRef<HTMLElement>>('panelToggleBtn');
  private readonly mosaicPanel = viewChild<ElementRef<HTMLElement>>('mosaicPanel');
  private readonly mosaicPanelToggleBtn = viewChild<ElementRef<HTMLElement>>('mosaicPanelToggleBtn');

  private A: any;
  private aladinInstance: any;
  private fovOverlay: any;
  private mosaicOverlapDeg: OverlapDeg = { widthDeg: 0, heightDeg: 0 };

  protected readonly telescopes = TELESCOPES;
  protected readonly cameras = CAMERAS;

  protected readonly panelOpen = signal(false);
  protected readonly mosaicPanelOpen = signal(false);
  protected readonly telescopeId = signal('es-ed127');
  protected readonly cameraId = signal('asi2600mm-pro');
  protected readonly reducerFactor = signal(0.7);
  protected readonly focalLengthMm = signal(0);
  protected readonly sensorWidthMm = signal(0);
  protected readonly sensorHeightMm = signal(0);
  protected readonly pixelSizeMicrons = signal(0);
  protected readonly fovResult = signal<FovResult | null>(null);
  protected readonly rotationAngleDeg = signal(0);
  protected readonly reticleVisible = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly searchError = signal<string | null>(null);
  protected readonly rows = signal(1);
  protected readonly columns = signal(1);
  protected readonly overlapPx = signal(20);

  constructor() {
    this.syncFocalLengthFromTelescope();
    this.syncCameraFieldsFromCamera();
  }

  async ngAfterViewInit(): Promise<void> {
    // Aladin Lite v2 (not v3): panning recomputes a flat gnomonic projection
    // centered on the new RA/Dec on every drag step, so the view never rolls
    // in the first place — unlike v3's WebGL/WASM trackball-style 3D camera,
    // which rotates the view on the celestial sphere while panning. v2 isn't
    // published on npm, so it's loaded as a global script from CDS's own CDN
    // (the same one their official "vanilla" embed docs point to), with
    // jQuery as its one hard dependency.
    if (!(window as any).jQuery) {
      await this.loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
    }
    this.loadStylesheet('https://aladin.cds.unistra.fr/AladinLite/api/v2/latest/aladin.min.css');
    await this.loadScript('https://aladin.cds.unistra.fr/AladinLite/api/v2/latest/aladin.min.js');

    this.A = (window as any).A;

    this.aladinInstance = this.A.aladin(this.container().nativeElement, {
      target: 'NGC 7000',
      fov: 8,
      cooFrame: 'equatorial',
      showCooGridControl: true,
      showSimbadPointerControl: true,
      showCooGrid: false
    });

    // Draw the FOV rectangle(s) as real sky-coordinate polygons rather than a
    // fixed CSS overlay. Aladin projects overlay shapes with the same WCS math
    // it uses for the sky tiles themselves, so they're always correctly
    // oriented to true north/east no matter how the view rotates while
    // panning — no need to read or fight Aladin's own view rotation at all.
    // Recentering on every positionChanged keeps it framed like a viewfinder
    // reticle (always showing what's currently centered) rather than marking
    // one fixed sky location.
    this.fovOverlay = this.A.graphicOverlay({ color: '#00e5a0', lineWidth: 2 });
    this.aladinInstance.addOverlay(this.fovOverlay);

    this.aladinInstance.on('positionChanged', () => this.redrawFovOverlay());
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private loadStylesheet(href: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  protected togglePanel(): void {
    this.panelOpen.update((open) => !open);
  }

  protected closePanel(): void {
    this.panelOpen.set(false);
  }

  protected toggleMosaicPanel(): void {
    this.mosaicPanelOpen.update((open) => !open);
  }

  protected closeMosaicPanel(): void {
    this.mosaicPanelOpen.set(false);
  }

  protected toggleReticleVisibility(): void {
    this.reticleVisible.update((visible) => !visible);
    this.redrawFovOverlay();
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchError.set(null);
  }

  protected search(): void {
    const query = this.searchQuery().trim();
    if (!query || !this.aladinInstance) {
      return;
    }

    this.searchError.set(null);
    this.aladinInstance.gotoObject(query, {
      success: () => this.searchError.set(null),
      error: () => this.searchError.set(`"${query}" not found`)
    });
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (this.panelOpen()) {
      const panelEl = this.panel()?.nativeElement;
      const toggleBtnEl = this.panelToggleBtn()?.nativeElement;
      if (!panelEl?.contains(target) && !toggleBtnEl?.contains(target)) {
        this.closePanel();
      }
    }

    if (this.mosaicPanelOpen()) {
      const mosaicPanelEl = this.mosaicPanel()?.nativeElement;
      const mosaicToggleBtnEl = this.mosaicPanelToggleBtn()?.nativeElement;
      if (!mosaicPanelEl?.contains(target) && !mosaicToggleBtnEl?.contains(target)) {
        this.closeMosaicPanel();
      }
    }
  }

  protected rotateBy(deltaDeg: number): void {
    this.setRotation(this.rotationAngleDeg() + deltaDeg);
  }

  protected setRotation(value: number): void {
    const clamped = Math.min(360, Math.max(0, value));
    this.rotationAngleDeg.set(clamped);
    this.redrawFovOverlay();
  }

  protected onRotationTextInput(value: string): void {
    const numeric = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (!Number.isNaN(numeric)) {
      this.setRotation(numeric);
    }
  }

  protected onTelescopeChange(id: string): void {
    this.telescopeId.set(id);
    if (id !== 'custom') {
      this.syncFocalLengthFromTelescope();
    }
  }

  protected onReducerChange(value: number): void {
    this.reducerFactor.set(value > 0 ? value : 1);
    if (this.telescopeId() !== 'custom') {
      this.syncFocalLengthFromTelescope();
    }
  }

  protected onFocalLengthInput(value: number): void {
    this.focalLengthMm.set(value);
    this.telescopeId.set('custom');
  }

  protected onCameraChange(id: string): void {
    this.cameraId.set(id);
    if (id !== 'custom') {
      this.syncCameraFieldsFromCamera();
    }
  }

  protected onSensorWidthInput(value: number): void {
    this.sensorWidthMm.set(value);
    this.cameraId.set('custom');
  }

  protected onSensorHeightInput(value: number): void {
    this.sensorHeightMm.set(value);
    this.cameraId.set('custom');
  }

  protected onPixelSizeInput(value: number): void {
    this.pixelSizeMicrons.set(value);
    this.cameraId.set('custom');
  }

  protected onRowsInput(value: number): void {
    this.rows.set(Math.max(1, Math.round(value)));
    this.refreshMosaicOverlapDeg();
    this.redrawFovOverlay();
  }

  protected onColumnsInput(value: number): void {
    this.columns.set(Math.max(1, Math.round(value)));
    this.refreshMosaicOverlapDeg();
    this.redrawFovOverlay();
  }

  protected onOverlapInput(value: number): void {
    this.overlapPx.set(Math.max(0, value));
    this.refreshMosaicOverlapDeg();
    this.redrawFovOverlay();
  }

  protected calculateFov(): void {
    const effectiveFocalLengthMm = this.focalLengthMm();
    if (!this.aladinInstance || effectiveFocalLengthMm <= 0 || this.sensorWidthMm() <= 0 || this.sensorHeightMm() <= 0) {
      return;
    }

    const widthDeg = this.angleForSensorDimension(this.sensorWidthMm(), effectiveFocalLengthMm);
    const heightDeg = this.angleForSensorDimension(this.sensorHeightMm(), effectiveFocalLengthMm);
    const pixelScaleArcsecPerPixel = (206.265 * this.pixelSizeMicrons()) / effectiveFocalLengthMm;
    this.fovResult.set({ widthDeg, heightDeg, pixelScaleArcsecPerPixel });
    this.reticleVisible.set(true);

    this.aladinInstance.setFov(8);

    this.refreshMosaicOverlapDeg();
    this.redrawFovOverlay();
  }

  protected formatAngle(deg: number): string {
    if (deg < 1) {
      return `${(deg * 60).toFixed(2)}'`;
    }
    return `${deg.toFixed(3)}°`;
  }

  /** Converts the user's pixel-based overlap input into a fixed degree value,
   *  using the view's current arcsec/pixel scale as the conversion basis. */
  private refreshMosaicOverlapDeg(): void {
    if (!this.aladinInstance) {
      return;
    }

    const [fovXdeg, fovYdeg]: [number, number] = this.aladinInstance.getFov();
    const [viewWidthPx, viewHeightPx]: [number, number] = this.aladinInstance.getSize();
    const overlapPx = Math.max(0, this.overlapPx());

    this.mosaicOverlapDeg = {
      widthDeg: (overlapPx / viewWidthPx) * fovXdeg,
      heightDeg: (overlapPx / viewHeightPx) * fovYdeg
    };
  }

  private redrawFovOverlay(): void {
    if (!this.aladinInstance || !this.fovOverlay || !this.A) {
      return;
    }

    this.fovOverlay.removeAll();

    const result = this.fovResult();
    if (!result || !this.reticleVisible()) {
      return;
    }

    const rows = Math.max(1, Math.round(this.rows()));
    const columns = Math.max(1, Math.round(this.columns()));
    const stepXDeg = result.widthDeg - this.mosaicOverlapDeg.widthDeg;
    const stepYDeg = result.heightDeg - this.mosaicOverlapDeg.heightDeg;
    const halfWidthDeg = result.widthDeg / 2;
    const halfHeightDeg = result.heightDeg / 2;

    const [centerRa, centerDec]: [number, number] = this.aladinInstance.getRaDec();
    const centerRaRad = (centerRa * Math.PI) / 180;
    const centerDecRad = (centerDec * Math.PI) / 180;
    const sinDec0 = Math.sin(centerDecRad);
    const cosDec0 = Math.cos(centerDecRad);
    const rotationRad = (this.rotationAngleDeg() * Math.PI) / 180;
    const cosRot = Math.cos(rotationRad);
    const sinRot = Math.sin(rotationRad);

    const footprints: any[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const tileOffsetXDeg = (col - (columns - 1) / 2) * stepXDeg;
        const tileOffsetYDeg = (row - (rows - 1) / 2) * stepYDeg;

        const localCorners: [number, number][] = [
          [-halfWidthDeg, -halfHeightDeg],
          [halfWidthDeg, -halfHeightDeg],
          [halfWidthDeg, halfHeightDeg],
          [-halfWidthDeg, halfHeightDeg]
        ];

        // Proper gnomonic (TAN) tangent-plane projection: (rotatedX, rotatedY)
        // are "standard coordinates" (xi, eta) around the view center, not a
        // flat degree offset. Using a single shared cos(dec) for every corner
        // (the old approach) doesn't correctly account for how a physically
        // rectangular sensor's true footprint curves on the sky — this is the
        // same inverse-TAN math real plate-solving/WCS tools use, and it's
        // what makes the rectangle behave sensibly at high declinations.
        const raDecCorners: [number, number][] = localCorners.map(([localX, localY]) => {
          const x = tileOffsetXDeg + localX;
          const y = tileOffsetYDeg + localY;
          const rotatedX = x * cosRot - y * sinRot;
          const rotatedY = x * sinRot + y * cosRot;

          const xi = (-rotatedX * Math.PI) / 180;
          const eta = (rotatedY * Math.PI) / 180;

          const denom = cosDec0 - eta * sinDec0;
          const deltaRaRad = Math.atan2(xi, denom);
          const decRad = Math.atan2(sinDec0 + eta * cosDec0, Math.sqrt(xi * xi + denom * denom));

          const ra = ((centerRaRad + deltaRaRad) * 180) / Math.PI;
          const dec = (decRad * 180) / Math.PI;
          return [ra, dec];
        });

        footprints.push(this.A.polygon(raDecCorners, { color: '#00e5a0', lineWidth: 2 }));
      }
    }

    this.fovOverlay.addFootprints(footprints);
  }

  private angleForSensorDimension(sensorMm: number, focalLengthMm: number): number {
    return (2 * Math.atan(sensorMm / (2 * focalLengthMm)) * 180) / Math.PI;
  }

  private syncFocalLengthFromTelescope(): void {
    const telescope = this.telescopes.find((t) => t.id === this.telescopeId());
    if (!telescope) {
      return;
    }
    const factor = this.reducerFactor() > 0 ? this.reducerFactor() : 1;
    this.focalLengthMm.set(telescope.focalLengthMm * factor);
  }

  private syncCameraFieldsFromCamera(): void {
    const camera = this.cameras.find((c) => c.id === this.cameraId());
    if (!camera) {
      return;
    }
    this.sensorWidthMm.set(camera.sensorWidthMm);
    this.sensorHeightMm.set(camera.sensorHeightMm);
    this.pixelSizeMicrons.set(camera.pixelSizeMicrons);
  }
}
