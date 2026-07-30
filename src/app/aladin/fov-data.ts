export interface Telescope {
  id: string;
  name: string;
  focalLengthMm: number;
}

export interface Camera {
  id: string;
  name: string;
  sensorWidthMm: number;
  sensorHeightMm: number;
  pixelSizeMicrons: number;
}

export const TELESCOPES: Telescope[] = [
  // Celestron
  { id: 'nexstar-4se', name: 'Celestron NexStar 4SE (1325mm f/13)', focalLengthMm: 1325 },
  { id: 'nexstar-5se', name: 'Celestron NexStar 5SE (1250mm f/10)', focalLengthMm: 1250 },
  { id: 'nexstar-6se', name: 'Celestron NexStar 6SE (1500mm f/10)', focalLengthMm: 1500 },
  { id: 'nexstar-8se', name: 'Celestron NexStar 8SE (2032mm f/10)', focalLengthMm: 2032 },
  { id: 'nexstar-127slt', name: 'Celestron NexStar 127SLT (1500mm f/12)', focalLengthMm: 1500 },
  { id: 'edgehd-8', name: 'Celestron EdgeHD 8 (2032mm f/10)', focalLengthMm: 2032 },
  { id: 'edgehd-925', name: 'Celestron EdgeHD 9.25 (2350mm f/10)', focalLengthMm: 2350 },
  { id: 'edgehd-11', name: 'Celestron EdgeHD 11 (2800mm f/10)', focalLengthMm: 2800 },
  { id: 'edgehd-14', name: 'Celestron EdgeHD 14 (3910mm f/11)', focalLengthMm: 3910 },
  { id: 'rasa-8', name: 'Celestron RASA 8 (400mm f/2)', focalLengthMm: 400 },
  { id: 'rasa-11', name: 'Celestron RASA 11 (620mm f/2.2)', focalLengthMm: 620 },
  { id: 'rasa-14', name: 'Celestron RASA 14 (790mm f/2.2)', focalLengthMm: 790 },
  { id: 'omni-xlt-120', name: 'Celestron Omni XLT 120 (1000mm f/8.3)', focalLengthMm: 1000 },
  { id: 'astromaster-130eq', name: 'Celestron AstroMaster 130EQ (650mm f/5)', focalLengthMm: 650 },

  // Sky-Watcher
  { id: 'evostar-72ed', name: 'Sky-Watcher Evostar 72ED (420mm f/5.8)', focalLengthMm: 420 },
  { id: 'evostar-80ed', name: 'Sky-Watcher Evostar 80ED (600mm f/7.5)', focalLengthMm: 600 },
  { id: 'evostar-100ed', name: 'Sky-Watcher Evostar 100ED (900mm f/9)', focalLengthMm: 900 },
  { id: 'esprit-80ed', name: 'Sky-Watcher Esprit 80ED (400mm f/5)', focalLengthMm: 400 },
  { id: 'esprit-100ed', name: 'Sky-Watcher Esprit 100ED (550mm f/5.5)', focalLengthMm: 550 },
  { id: 'esprit-120ed', name: 'Sky-Watcher Esprit 120ED (840mm f/7)', focalLengthMm: 840 },
  { id: 'esprit-150ed', name: 'Sky-Watcher Esprit 150ED (1050mm f/7)', focalLengthMm: 1050 },
  { id: 'explorer-130p', name: 'Sky-Watcher Explorer 130P (650mm f/5)', focalLengthMm: 650 },
  { id: 'explorer-150p', name: 'Sky-Watcher Explorer 150P (750mm f/5)', focalLengthMm: 750 },
  { id: 'explorer-200p', name: 'Sky-Watcher Explorer 200P (1000mm f/5)', focalLengthMm: 1000 },
  { id: 'quattro-200p', name: 'Sky-Watcher Quattro 200P (800mm f/4)', focalLengthMm: 800 },
  { id: 'quattro-250p', name: 'Sky-Watcher Quattro 250P (1000mm f/4)', focalLengthMm: 1000 },
  { id: 'skymax-127', name: 'Sky-Watcher Skymax 127 Mak (1500mm f/11.8)', focalLengthMm: 1500 },
  { id: 'skymax-180', name: 'Sky-Watcher Skymax 180 Mak (2700mm f/15)', focalLengthMm: 2700 },

  // Meade
  { id: 'lx200-8', name: 'Meade LX200 8" (2000mm f/10)', focalLengthMm: 2000 },
  { id: 'lx200-10', name: 'Meade LX200 10" (2500mm f/10)', focalLengthMm: 2500 },
  { id: 'lx200-12', name: 'Meade LX200 12" (3000mm f/10)', focalLengthMm: 3000 },
  { id: 'lx85-6-mak', name: 'Meade LX85 6" Maksutov (1800mm f/12)', focalLengthMm: 1800 },
  { id: 'lx85-6-acf', name: 'Meade LX85 6" ACF (1520mm f/10)', focalLengthMm: 1520 },
  { id: 'etx-90', name: 'Meade ETX-90 (1250mm f/13.8)', focalLengthMm: 1250 },

  // Takahashi
  { id: 'fsq-85edx', name: 'Takahashi FSQ-85EDX (450mm f/5.3)', focalLengthMm: 450 },
  { id: 'fsq-106ed', name: 'Takahashi FSQ-106ED (530mm f/5)', focalLengthMm: 530 },
  { id: 'fsq-130ed', name: 'Takahashi FSQ-130ED (760mm f/5)', focalLengthMm: 760 },
  { id: 'fs-60cb', name: 'Takahashi FS-60CB (355mm f/5.9)', focalLengthMm: 355 },
  { id: 'tsa-120', name: 'Takahashi TSA-120 (900mm f/7.5)', focalLengthMm: 900 },
  { id: 'mewlon-180c', name: 'Takahashi Mewlon-180C (2160mm f/12)', focalLengthMm: 2160 },
  { id: 'mewlon-210', name: 'Takahashi Mewlon-210 (2415mm f/11.5)', focalLengthMm: 2415 },

  // William Optics
  { id: 'redcat-51', name: 'William Optics RedCat 51 (250mm f/4.9)', focalLengthMm: 250 },
  { id: 'redcat-61', name: 'William Optics RedCat 61 (300mm f/4.9)', focalLengthMm: 300 },
  { id: 'zenithstar-61', name: 'William Optics ZenithStar 61 (360mm f/5.9)', focalLengthMm: 360 },
  { id: 'zenithstar-71', name: 'William Optics ZenithStar 71 (418mm f/5.9)', focalLengthMm: 418 },
  { id: 'zenithstar-73', name: 'William Optics ZenithStar 73 (430mm f/5.9)', focalLengthMm: 430 },
  { id: 'gt81', name: 'William Optics GT81 (478mm f/5.9)', focalLengthMm: 478 },
  { id: 'flt132', name: 'William Optics FLT132 (925mm f/7)', focalLengthMm: 925 },

  // Orion
  { id: 'ed80t-cf', name: 'Orion ED80T CF (480mm f/6)', focalLengthMm: 480 },
  { id: 'orion-8f39', name: 'Orion 8" f/3.9 Newtonian Astrograph (800mm f/3.9)', focalLengthMm: 800 },
  { id: 'orion-10f39', name: 'Orion 10" f/3.9 Newtonian Astrograph (1000mm f/3.9)', focalLengthMm: 1000 },
  { id: 'skyquest-xt8', name: 'Orion SkyQuest XT8 Dobsonian (1200mm f/5.9)', focalLengthMm: 1200 },
  { id: 'starblast-45', name: 'Orion StarBlast 4.5 (425mm f/4)', focalLengthMm: 425 },

  // Explore Scientific
  { id: 'es-ed80', name: 'Explore Scientific ED80 (480mm f/6)', focalLengthMm: 480 },
  { id: 'es-ed102cf', name: 'Explore Scientific ED102 CF (714mm f/7)', focalLengthMm: 714 },
  { id: 'es-ed127', name: 'Explore Scientific ED127 (952mm f/7.5)', focalLengthMm: 952 },
  { id: 'es-ed152', name: 'Explore Scientific ED152 (1200mm f/7.9)', focalLengthMm: 1200 },

  // Vixen
  { id: 'vixen-ed81s', name: 'Vixen ED81S (625mm f/7.7)', focalLengthMm: 625 },
  { id: 'vixen-vc200l', name: 'Vixen VC200L VISAC (1800mm f/9)', focalLengthMm: 1800 },
  { id: 'vixen-vsd100f38', name: 'Vixen VSD100F3.8 (380mm f/3.8)', focalLengthMm: 380 },

  // Stellarvue
  { id: 'sv70t', name: 'Stellarvue SV70T (420mm f/6)', focalLengthMm: 420 },
  { id: 'svx080t', name: 'Stellarvue SVX080T (480mm f/6)', focalLengthMm: 480 },

  // TS-Optics / APM
  { id: 'ts-photoline-80', name: 'TS-Optics Photoline 80mm (480mm f/6)', focalLengthMm: 480 },
  { id: 'ts-photoline-130', name: 'TS-Optics Photoline 130mm (910mm f/7)', focalLengthMm: 910 },
  { id: 'apm-107-lzos', name: 'APM 107mm LZOS Triplet (700mm f/6.5)', focalLengthMm: 700 }
];

export const CAMERAS: Camera[] = [
  // ZWO ASI
  { id: 'asi120mm-mini', name: 'ZWO ASI120MM Mini (4.8 x 3.6mm)', sensorWidthMm: 4.8, sensorHeightMm: 3.6, pixelSizeMicrons: 3.75 },
  { id: 'asi224mc', name: 'ZWO ASI224MC (4.8 x 3.6mm)', sensorWidthMm: 4.8, sensorHeightMm: 3.6, pixelSizeMicrons: 3.75 },
  { id: 'asi462mc', name: 'ZWO ASI462MC (5.6 x 3.2mm)', sensorWidthMm: 5.6, sensorHeightMm: 3.2, pixelSizeMicrons: 2.9 },
  { id: 'asi290mm-mini', name: 'ZWO ASI290MM Mini (5.6 x 3.2mm)', sensorWidthMm: 5.6, sensorHeightMm: 3.2, pixelSizeMicrons: 2.9 },
  { id: 'asi178mc', name: 'ZWO ASI178MC (7.4 x 5.0mm)', sensorWidthMm: 7.4, sensorHeightMm: 5.0, pixelSizeMicrons: 2.4 },
  { id: 'asi385mc', name: 'ZWO ASI385MC (7.3 x 4.1mm)', sensorWidthMm: 7.3, sensorHeightMm: 4.1, pixelSizeMicrons: 3.75 },
  { id: 'asi183mc-pro', name: 'ZWO ASI183MC Pro (13.2 x 8.8mm)', sensorWidthMm: 13.2, sensorHeightMm: 8.8, pixelSizeMicrons: 2.4 },
  { id: 'asi183mm-pro', name: 'ZWO ASI183MM Pro (13.2 x 8.8mm)', sensorWidthMm: 13.2, sensorHeightMm: 8.8, pixelSizeMicrons: 2.4 },
  { id: 'asi1600mm-pro', name: 'ZWO ASI1600MM Pro (17.7 x 13.4mm)', sensorWidthMm: 17.7, sensorHeightMm: 13.4, pixelSizeMicrons: 3.8 },
  { id: 'asi1600mc-pro', name: 'ZWO ASI1600MC Pro (17.7 x 13.4mm)', sensorWidthMm: 17.7, sensorHeightMm: 13.4, pixelSizeMicrons: 3.8 },
  { id: 'asi294mc-pro', name: 'ZWO ASI294MC Pro (19.1 x 13.0mm)', sensorWidthMm: 19.1, sensorHeightMm: 13.0, pixelSizeMicrons: 4.63 },
  { id: 'asi294mm-pro', name: 'ZWO ASI294MM Pro (19.1 x 13.0mm)', sensorWidthMm: 19.1, sensorHeightMm: 13.0, pixelSizeMicrons: 4.63 },
  { id: 'asi533mc-pro', name: 'ZWO ASI533MC Pro (11.3 x 11.3mm)', sensorWidthMm: 11.3, sensorHeightMm: 11.3, pixelSizeMicrons: 3.76 },
  { id: 'asi533mm-pro', name: 'ZWO ASI533MM Pro (11.3 x 11.3mm)', sensorWidthMm: 11.3, sensorHeightMm: 11.3, pixelSizeMicrons: 3.76 },
  { id: 'asi071mc-pro', name: 'ZWO ASI071MC Pro (23.6 x 15.6mm)', sensorWidthMm: 23.6, sensorHeightMm: 15.6, pixelSizeMicrons: 4.78 },
  { id: 'asi2600mc-pro', name: 'ZWO ASI2600MC Pro (23.5 x 15.7mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.7, pixelSizeMicrons: 3.76 },
  { id: 'asi2600mm-pro', name: 'ZWO ASI2600MM Pro (23.5 x 15.7mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.7, pixelSizeMicrons: 3.76 },
  { id: 'asi2400mc-pro', name: 'ZWO ASI2400MC Pro (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 5.94 },
  { id: 'asi6200mc-pro', name: 'ZWO ASI6200MC Pro (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 3.76 },
  { id: 'asi6200mm-pro', name: 'ZWO ASI6200MM Pro (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 3.76 },

  // QHY
  { id: 'qhy168c', name: 'QHY168C (23.5 x 15.7mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.7, pixelSizeMicrons: 4.78 },
  { id: 'qhy268c', name: 'QHY268C (23.5 x 15.7mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.7, pixelSizeMicrons: 3.76 },
  { id: 'qhy294c-pro', name: 'QHY294C Pro (19.1 x 13.0mm)', sensorWidthMm: 19.1, sensorHeightMm: 13.0, pixelSizeMicrons: 4.63 },
  { id: 'qhy600m', name: 'QHY600M (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 3.76 },
  { id: 'qhy410c', name: 'QHY410C (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 5.94 },

  // Player One
  { id: 'p1-neptune-c-ii', name: 'Player One Neptune-C II (7.68 x 4.32mm)', sensorWidthMm: 7.68, sensorHeightMm: 4.32, pixelSizeMicrons: 2.9 },
  { id: 'p1-uranus-c', name: 'Player One Uranus-C (11.2 x 6.3mm)', sensorWidthMm: 11.2, sensorHeightMm: 6.3, pixelSizeMicrons: 2.9 },
  { id: 'p1-poseidon-c-pro', name: 'Player One Poseidon-C Pro (23.5 x 15.7mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.7, pixelSizeMicrons: 3.76 },

  // DSLR / Mirrorless
  { id: 'canon-90d', name: 'Canon EOS 90D (APS-C, 22.3 x 14.9mm)', sensorWidthMm: 22.3, sensorHeightMm: 14.9, pixelSizeMicrons: 3.2 },
  { id: 'canon-t7i', name: 'Canon EOS Rebel T7i / 800D (APS-C, 22.3 x 14.9mm)', sensorWidthMm: 22.3, sensorHeightMm: 14.9, pixelSizeMicrons: 3.72 },
  { id: 'canon-eos-ra', name: 'Canon EOS Ra (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 5.36 },
  { id: 'canon-6d-mk2', name: 'Canon EOS 6D Mark II (35.9 x 24.0mm)', sensorWidthMm: 35.9, sensorHeightMm: 24.0, pixelSizeMicrons: 5.75 },
  { id: 'canon-r5', name: 'Canon EOS R5 (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 4.39 },
  { id: 'canon-r6', name: 'Canon EOS R6 (36.0 x 24.0mm)', sensorWidthMm: 36.0, sensorHeightMm: 24.0, pixelSizeMicrons: 6.54 },
  { id: 'nikon-d5600', name: 'Nikon D5600 (APS-C, 23.5 x 15.6mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.6, pixelSizeMicrons: 3.92 },
  { id: 'nikon-d750', name: 'Nikon D750 (35.9 x 24.0mm)', sensorWidthMm: 35.9, sensorHeightMm: 24.0, pixelSizeMicrons: 5.97 },
  { id: 'nikon-d850', name: 'Nikon D850 (35.9 x 23.9mm)', sensorWidthMm: 35.9, sensorHeightMm: 23.9, pixelSizeMicrons: 4.35 },
  { id: 'nikon-z6ii', name: 'Nikon Z6 II (35.9 x 23.9mm)', sensorWidthMm: 35.9, sensorHeightMm: 23.9, pixelSizeMicrons: 5.94 },
  { id: 'sony-a6400', name: 'Sony A6400 (APS-C, 23.5 x 15.6mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.6, pixelSizeMicrons: 3.92 },
  { id: 'sony-a7iii', name: 'Sony A7 III (35.6 x 23.8mm)', sensorWidthMm: 35.6, sensorHeightMm: 23.8, pixelSizeMicrons: 5.93 },
  { id: 'sony-a7siii', name: 'Sony A7S III (35.6 x 23.8mm)', sensorWidthMm: 35.6, sensorHeightMm: 23.8, pixelSizeMicrons: 8.4 },
  { id: 'fuji-xt4', name: 'Fujifilm X-T4 (APS-C, 23.5 x 15.6mm)', sensorWidthMm: 23.5, sensorHeightMm: 15.6, pixelSizeMicrons: 3.76 },
  { id: 'fuji-gfx100s', name: 'Fujifilm GFX 100S (Medium Format, 43.8 x 32.9mm)', sensorWidthMm: 43.8, sensorHeightMm: 32.9, pixelSizeMicrons: 3.76 }
];
