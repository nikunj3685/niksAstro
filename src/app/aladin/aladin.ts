import { AfterViewInit, Component, computed, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CAMERAS, TELESCOPES } from './fov-data';

interface FovResult {
  widthDeg: number;
  heightDeg: number;
  pixelScaleArcsecPerPixel: number;
}

interface ReticleSize {
  widthPx: number;
  heightPx: number;
}

interface MosaicTile {
  leftPx: number;
  topPx: number;
}

interface MosaicBounds {
  widthPx: number;
  heightPx: number;
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

  private aladinInstance: any;

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
  protected readonly reticleSize = signal<ReticleSize | null>(null);
  protected readonly rotationAngleDeg = signal(0);
  // Aladin's own view can drift in field rotation while panning (it pans by
  // rotating on the celestial sphere, not a flat translate). Rather than
  // fighting that by writing back into Aladin (setRotation() is an expensive
  // WASM-side recompute), we just read the drift and counter-rotate our own
  // overlay so it keeps representing the same true sky position angle.
  protected readonly viewRollDeg = signal(0);
  protected readonly effectiveRotationDeg = computed(() => this.rotationAngleDeg() - this.viewRollDeg());
  protected readonly reticleVisible = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly searchError = signal<string | null>(null);
  protected readonly rows = signal(1);
  protected readonly columns = signal(1);
  protected readonly overlapPx = signal(20);

  protected readonly mosaicTiles = computed<MosaicTile[]>(() => {
    const reticle = this.reticleSize();
    if (!reticle) {
      return [];
    }

    const rows = Math.max(1, Math.round(this.rows()));
    const columns = Math.max(1, Math.round(this.columns()));
    const overlap = Math.max(0, this.overlapPx());

    const stepX = reticle.widthPx - overlap;
    const stepY = reticle.heightPx - overlap;

    const tiles: MosaicTile[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        tiles.push({
          leftPx: (col - (columns - 1) / 2) * stepX,
          topPx: (row - (rows - 1) / 2) * stepY
        });
      }
    }
    return tiles;
  });

  protected readonly mosaicBounds = computed<MosaicBounds | null>(() => {
    const reticle = this.reticleSize();
    if (!reticle) {
      return null;
    }

    const rows = Math.max(1, Math.round(this.rows()));
    const columns = Math.max(1, Math.round(this.columns()));
    const overlap = Math.max(0, this.overlapPx());

    return {
      widthPx: columns * reticle.widthPx - (columns - 1) * overlap,
      heightPx: rows * reticle.heightPx - (rows - 1) * overlap
    };
  });

  constructor() {
    this.syncFocalLengthFromTelescope();
    this.syncCameraFieldsFromCamera();
  }

  async ngAfterViewInit(): Promise<void> {
    const A = (await import('aladin-lite')).default;
    await A.init;

    this.aladinInstance = A.aladin(this.container().nativeElement, {
      target: 'NGC 7000',
      fov: 8,
      cooFrame: 'equatorial',
      showCooGridControl: true,
      showSimbadPointerControl: true,
      showCooGrid: false
    });

    this.aladinInstance.on('zoomChanged', () => this.updateReticleSize());
    this.aladinInstance.on('positionChanged', () => {
      this.viewRollDeg.set(this.aladinInstance.getRotation());
    });
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
  }

  protected onColumnsInput(value: number): void {
    this.columns.set(Math.max(1, Math.round(value)));
  }

  protected onOverlapInput(value: number): void {
    this.overlapPx.set(Math.max(0, value));
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

    this.aladinInstance.setFoV(8);

    this.updateReticleSize();
  }

  protected formatAngle(deg: number): string {
    if (deg < 1) {
      return `${(deg * 60).toFixed(2)}'`;
    }
    return `${deg.toFixed(3)}°`;
  }

  private updateReticleSize(): void {
    const result = this.fovResult();
    if (!result || !this.aladinInstance) {
      return;
    }

    const [fovXdeg, fovYdeg]: [number, number] = this.aladinInstance.getFov();
    const [viewWidthPx, viewHeightPx]: [number, number] = this.aladinInstance.getSize();

    this.reticleSize.set({
      widthPx: (result.widthDeg / fovXdeg) * viewWidthPx,
      heightPx: (result.heightDeg / fovYdeg) * viewHeightPx
    });
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
