import { describe, expect, it } from 'vitest';
import { MEASUREMENT_GRID_WIDTH } from '../src/illusions/guideHelpers';
import { illusionGroups, illusionIds, illusions, mediaGroups, randomizeParams } from '../src/illusions/registry';
import { createRng } from '../src/rng';

describe('illusion registry', () => {
  it('registers the retained 18 v0.3 illusions in display order', () => {
    expect(illusionIds).toEqual([
      'cafe-wall',
      'hermann-grid',
      'muller-lyer',
      'ponzo',
      'poggendorff',
      'zollner',
      'hering',
      'vertical-horizontal',
      'ebbinghaus',
      'delboeuf',
      'sander-parallelogram',
      'kanizsa-triangle',
      'rubin-vase',
      'simultaneous-contrast',
      'whites-illusion',
      'cornsweet',
      'lilac-chaser',
      'rotating-necker-cube'
    ]);
  });

  it('exposes renderers, schemas, defaults, and SVG output for every illusion', () => {
    for (const illusion of illusions) {
      expect(typeof illusion.renderCanvas).toBe('function');
      expect(typeof illusion.renderSvg).toBe('function');
      expect(illusion.paramSchema.length).toBeGreaterThan(0);
      expect(Object.keys(illusion.defaultParams).sort()).toEqual(illusion.paramSchema.map((control) => control.key).sort());
      expect(illusion.renderSvg(illusion.defaultParams)).toMatch(/^<svg /);
    }
  });

  it('keeps guide overlays off by default and after generated params', () => {
    for (const illusion of illusions) {
      if (!illusion.paramSchema.some((control) => control.key === 'showGuide')) {
        continue;
      }

      expect(illusion.defaultParams.showGuide, `${illusion.id} default`).toBe(false);
      expect(randomizeParams(illusion, 'guide-reset-a').showGuide, `${illusion.id} generated a`).toBe(false);
      expect(randomizeParams(illusion, 'guide-reset-b').showGuide, `${illusion.id} generated b`).toBe(false);
    }
  });

  it('groups every illusion exactly once', () => {
    expect(mediaGroups.map((group) => group.id)).toEqual(['static', 'video']);
    expect(mediaGroups.map((group) => group.titleKey)).toEqual(['media.static', 'media.video']);
    expect(illusionGroups.map((group) => group.id)).toEqual([
      'geometry',
      'figureGround',
      'colorBrightness',
      'motionAfterimage',
      'reversibleDepth'
    ]);
    expect(illusionGroups.map((group) => group.titleKey)).toEqual([
      'category.geometry',
      'category.figureGround',
      'category.colorBrightness',
      'category.motionAfterimage',
      'category.reversibleDepth'
    ]);

    const groupedIds = illusionGroups.flatMap((group) => group.illusions.map((illusion) => illusion.id));
    expect(groupedIds).toEqual(illusionIds);
    expect(new Set(groupedIds).size).toBe(illusionIds.length);
    expect(illusionGroups.map((group) => group.illusions.length)).toEqual([12, 1, 3, 1, 1]);
    expect(mediaGroups.map((media) => media.groups.length)).toEqual([3, 2]);
    expect(illusionIds).not.toEqual(expect.arrayContaining([
      'necker-cube',
      'fraser-spiral',
      'penrose-triangle',
      'impossible-cube',
      'impossible-trident',
      'endless-stairs',
      'schroder-staircase',
      'shepard-tables',
      'duck-rabbit',
      'mach-bands',
      'peripheral-drift',
      'moire-motion',
      'ouchi-illusion',
      'pinna-brelstaff',
      'rotating-ames-window',
      'hollow-mask',
      'railway-perspective',
      'perspective-grid',
      'size-constancy-corridor',
      'ames-room',
      'moon-illusion',
      'forced-perspective-blocks',
      'ponzo-corridor',
      'horizon-size-contrast',
      'optic-flow-tunnel',
      'looming-corridor',
      'motion-parallax-depth-field'
    ]));
  });

  it('marks the animated illusions', () => {
    expect(illusions.filter((illusion) => illusion.supportsAnimation).map((illusion) => illusion.id)).toEqual([
      'lilac-chaser',
      'rotating-necker-cube'
    ]);
  });

  it('lets Mﾃｼller-Lyer hide the guide line in SVG output', () => {
    const muller = illusions.find((illusion) => illusion.id === 'muller-lyer');

    expect(muller).toBeTruthy();
    expect(muller!.defaultParams.showGuide).toBe(false);
    const withGuide = muller!.renderSvg({ ...muller!.defaultParams, showGuide: true });
    const withoutGuide = muller!.renderSvg({ ...muller!.defaultParams, showGuide: false });
    const lineCount = (value: string) => value.match(/<line/g)?.length ?? 0;

    expect(withGuide).toContain('x1="0" y1="0" x2="0" y2="1600"');
    expect(withGuide).toContain('x1="0" y1="800" x2="1600" y2="800"');
    expect(lineCount(withGuide)).toBeGreaterThan(lineCount(withoutGuide) + 30);
    expect(withoutGuide).not.toContain('x1="0" y1="0" x2="0" y2="1600"');
  });


  it('uses guide-color labels only for accent controls that color guide-only overlays', () => {
    for (const id of ['cafe-wall', 'hermann-grid', 'muller-lyer', 'vertical-horizontal', 'kanizsa-triangle', 'rubin-vase']) {
      const illusion = illusions.find((candidate) => candidate.id === id);
      const accent = illusion?.paramSchema.find((control) => control.key === 'accentColor');

      expect(accent?.labelKey, id).toBe('param.guideColor');
    }

    for (const id of ['lilac-chaser']) {
      const illusion = illusions.find((candidate) => candidate.id === id);
      const accent = illusion?.paramSchema.find((control) => control.key === 'accentColor');

      expect(accent?.labelKey, id).toBe('param.accentColor');
    }

    for (const id of ['rotating-necker-cube']) {
      const illusion = illusions.find((candidate) => candidate.id === id);
      const accent = illusion?.paramSchema.find((control) => control.key === 'accentColor');
      const colorB = illusion?.paramSchema.find((control) => control.key === 'colorB');

      expect(accent?.labelKey, id).toBe('param.face1Color');
      expect(colorB?.labelKey, id).toBe('param.face2Color');
    }
  });


  it('renders Hermann Grid without real intersection dots and marks every intersection as guide', () => {
    const hermann = illusions.find((illusion) => illusion.id === 'hermann-grid');

    expect(hermann).toBeTruthy();
    expect(hermann!.paramSchema.map((control) => control.key)).not.toEqual(expect.arrayContaining(['dotRadius', 'dotOpacity']));

    const count = Number(hermann!.defaultParams.gridCount);
    const withGuide = hermann!.renderSvg({ ...hermann!.defaultParams, showGuide: true });
    const withoutGuide = hermann!.renderSvg({ ...hermann!.defaultParams, showGuide: false });
    const circleCount = (value: string) => value.match(/<circle/g)?.length ?? 0;

    expect(circleCount(withoutGuide)).toBe(0);
    expect(circleCount(withGuide)).toBe(count * count);
  });


  it('keeps Rotating Necker Cube guide faces opaque and manual face fills translucent', () => {
    const necker = illusions.find((illusion) => illusion.id === 'rotating-necker-cube');

    expect(necker).toBeTruthy();
    expect(necker!.paramSchema.map((control) => control.key)).not.toEqual(expect.arrayContaining(['showContext', 'showTargets', 'showShadow']));
    expect(necker!.paramSchema.map((control) => control.key)).toEqual(expect.arrayContaining(['showFace1', 'showFace2']));
    const withGuide = necker!.renderSvg({ ...necker!.defaultParams, showGuide: true });
    const withFaces = necker!.renderSvg({ ...necker!.defaultParams, showFace1: true, showFace2: true });

    expect(withGuide.match(/data-necker-guide-face=/g)?.length).toBe(2);
    expect(withGuide).toContain(String(necker!.defaultParams.accentColor));
    expect(withGuide.indexOf('data-necker-guide-face=')).toBeGreaterThan(withGuide.lastIndexOf('<line'));
    expect(withGuide).not.toContain('opacity="0.26"');
    expect(withFaces).toContain('data-necker-face="face1"');
    expect(withFaces).toContain('data-necker-face="face2"');
    expect(withFaces).toContain(String(necker!.defaultParams.colorB));
    expect(withFaces.match(/opacity="0.26"/g)?.length).toBe(2);
    expect(withGuide).not.toContain('rgba(15, 118, 110, 0.10)');
    expect(withGuide).not.toContain('rgba(245, 158, 11, 0.12)');
  });

  it('draws Kanizsa Triangle from cut-out disks and three corner shapes', () => {
    const kanizsa = illusions.find((illusion) => illusion.id === 'kanizsa-triangle');

    expect(kanizsa).toBeTruthy();
    expect(kanizsa!.paramSchema.map((control) => control.key)).not.toEqual(expect.arrayContaining(['cornerLength', 'gap']));
    expect(kanizsa!.paramSchema.map((control) => control.key)).toContain('dotRadius');

    const withoutGuide = kanizsa!.renderSvg({ ...kanizsa!.defaultParams, showGuide: false });
    const withGuide = kanizsa!.renderSvg({ ...kanizsa!.defaultParams, showGuide: true });
    const defaultRadius = Number(kanizsa!.defaultParams.dotRadius);
    const lineCount = (value: string) => value.match(/<line/g)?.length ?? 0;
    const circleCount = (value: string) => value.match(/<circle/g)?.length ?? 0;
    const cornerLines = [...withoutGuide.matchAll(/<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)]
      .map((match) => ({
        start: [Number(match[1]), Number(match[2])] as [number, number],
        end: [Number(match[3]), Number(match[4])] as [number, number]
      }));
    const length = (line: (typeof cornerLines)[number]) =>
      Math.hypot(line.end[0] - line.start[0], line.end[1] - line.start[1]);
    const angleBetween = (first: (typeof cornerLines)[number], second: (typeof cornerLines)[number]) => {
      const ax = first.end[0] - first.start[0];
      const ay = first.end[1] - first.start[1];
      const bx = second.end[0] - second.start[0];
      const by = second.end[1] - second.start[1];
      const cosine = (ax * bx + ay * by) / (length(first) * length(second));
      return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
    };
    const guidePoints = (withGuide.match(/<polygon points="([^"]+)"/)?.[1] ?? '')
      .split(' ')
      .map((pair) => pair.split(',').map(Number) as [number, number]);
    const guideCenter: [number, number] = [
      (guidePoints[0][0] + guidePoints[1][0] + guidePoints[2][0]) / 3,
      (guidePoints[0][1] + guidePoints[1][1] + guidePoints[2][1]) / 3
    ];
    const reflect = (point: [number, number]): [number, number] => [
      guideCenter[0] * 2 - point[0],
      guideCenter[1] * 2 - point[1]
    ];
    const invertedVertices = [reflect(guidePoints[2]), reflect(guidePoints[1]), reflect(guidePoints[0])];
    const cornerVertices = [cornerLines[0].start, cornerLines[2].start, cornerLines[4].start];

    expect(lineCount(withoutGuide)).toBe(6);
    expect(circleCount(withoutGuide)).toBe(3);
    expect(cornerLines).toHaveLength(6);
    for (let index = 0; index < cornerLines.length; index += 2) {
      expect(length(cornerLines[index])).toBeCloseTo(defaultRadius, 2);
      expect(length(cornerLines[index + 1])).toBeCloseTo(defaultRadius, 2);
      expect(angleBetween(cornerLines[index], cornerLines[index + 1])).toBeCloseTo(60, 3);
    }
    for (const [index, vertex] of cornerVertices.entries()) {
      expect(vertex[0]).toBeCloseTo(invertedVertices[index][0], 3);
      expect(vertex[1]).toBeCloseTo(invertedVertices[index][1], 3);
    }
    expect(withoutGuide).toContain('M 800 419.795 L 899.9 592.827 A 199.8 199.8 0 0 1 700.1 592.827 Z');
    expect(withGuide).toContain('points="800,419.795 400,1112.615 1200,1112.615"');
    expect(withGuide).toContain('stroke-dasharray="26 20"');
    expect(circleCount(withGuide)).toBeGreaterThan(circleCount(withoutGuide));
  });





  it('uses only the full square grid for Hering SVG guides', () => {
    const lineCount = (value: string) => value.match(/<line/g)?.length ?? 0;

    const illusion = illusions.find((candidate) => candidate.id === 'hering');

    expect(illusion).toBeTruthy();
    const withGuide = illusion!.renderSvg({ ...illusion!.defaultParams, showGuide: true });
    const withoutGuide = illusion!.renderSvg({ ...illusion!.defaultParams, showGuide: false });

    expect(withGuide).toContain('x1="0" y1="0" x2="0" y2="1600"');
    expect(withGuide).toContain('x1="0" y1="800" x2="1600" y2="800"');
    expect(withGuide).toContain(`stroke-width="${MEASUREMENT_GRID_WIDTH}"`);
    expect(withGuide).not.toContain('stroke-width="21"');
    expect(lineCount(withGuide) - lineCount(withoutGuide)).toBe(34);
    expect(withoutGuide).not.toContain('x1="0" y1="0" x2="0" y2="1600"');
  });





  it('lets Rubin Vase show face and vase guide markers in SVG output', () => {
    const rubin = illusions.find((illusion) => illusion.id === 'rubin-vase');

    expect(rubin).toBeTruthy();
    const withGuide = rubin!.renderSvg({ ...rubin!.defaultParams, showGuide: true });
    const withoutGuide = rubin!.renderSvg({ ...rubin!.defaultParams, showGuide: false });

    expect(rubin!.paramSchema.map((control) => control.key)).not.toContain('lineWidth');
    expect(withGuide).toContain('<circle');
    expect(withGuide).toContain('stroke-dasharray="10 14"');
    expect(withGuide).toContain(String(rubin!.defaultParams.accentColor));
    for (const feature of ['forehead', 'brow', 'eye', 'nose', 'upperLip', 'lowerLip', 'chin']) {
      expect(withGuide).toContain(`data-rubin-feature="${feature}-left"`);
      expect(withGuide).toContain(`data-rubin-feature="${feature}-right"`);
      expect(withGuide).toContain(`data-rubin-feature="${feature}-level"`);
    }
    expect(withoutGuide).not.toContain('<circle');
    expect(withoutGuide).not.toContain('stroke-dasharray="10 14"');
    expect(withoutGuide).not.toContain('data-rubin-feature=');
  });



  it('lets Rotating Necker Cube fill the two named faces in SVG output', () => {
    const necker = illusions.find((illusion) => illusion.id === 'rotating-necker-cube');

    expect(necker).toBeTruthy();
    const withFaces = necker!.renderSvg({ ...necker!.defaultParams, showFace1: true, showFace2: true });
    const withoutFaces = necker!.renderSvg({ ...necker!.defaultParams, showFace1: false, showFace2: false });

    expect(withFaces).toContain('data-necker-face="face1"');
    expect(withFaces).toContain('data-necker-face="face2"');
    expect(withFaces).toContain(String(necker!.defaultParams.accentColor));
    expect(withFaces).toContain(String(necker!.defaultParams.colorB));
    expect(withFaces).toContain('opacity="0.26"');
    expect(withoutFaces).not.toContain('data-necker-face=');
  });




  it('lets Lilac Chaser show the missing-dot orbit guide in SVG output', () => {
    const lilac = illusions.find((illusion) => illusion.id === 'lilac-chaser');

    expect(lilac).toBeTruthy();
    const withGuide = lilac!.renderSvg({ ...lilac!.defaultParams, showGuide: true });
    const withoutGuide = lilac!.renderSvg({ ...lilac!.defaultParams, showGuide: false });

    expect(withGuide).toContain('stroke-dasharray="20 22"');
    expect(withGuide).toContain(String(lilac!.defaultParams.foreground));
    expect(withoutGuide).not.toContain('stroke-dasharray="20 22"');
  });


  it('lets Cornsweet show same-gray diagonal samples in SVG output', () => {
    const cornsweet = illusions.find((illusion) => illusion.id === 'cornsweet');

    expect(cornsweet).toBeTruthy();
    const withGuide = cornsweet!.renderSvg({ ...cornsweet!.defaultParams, showGuide: true });
    const withoutGuide = cornsweet!.renderSvg({ ...cornsweet!.defaultParams, showGuide: false });
    const diagonalCount = (value: string) =>
      value.match(/<line x1="-?\d+" y1="-1600" x2="\d+" y2="3200" stroke="#acacac" stroke-width="12"/g)?.length ?? 0;

    expect(withGuide).toContain('#acacac');
    expect(diagonalCount(withGuide)).toBeGreaterThanOrEqual(20);
    expect(diagonalCount(withoutGuide)).toBe(0);
  });

  it('keeps seeded random values inside each control range', () => {
    for (const illusion of illusions) {
      for (const seed of ['audit-a', 'audit-b', 'audit-c', 'audit-d', 'audit-e']) {
        const values = illusion.randomize(createRng(`${illusion.id}:${seed}`));

        for (const control of illusion.paramSchema) {
          const value = values[control.key];

          if (control.kind === 'range') {
            expect(value, `${illusion.id}.${control.key}`).toBeGreaterThanOrEqual(control.min);
            expect(value, `${illusion.id}.${control.key}`).toBeLessThanOrEqual(control.max);
          } else if (control.kind === 'toggle') {
            expect(typeof value, `${illusion.id}.${control.key}`).toBe('boolean');
          } else {
            expect(String(value), `${illusion.id}.${control.key}`).toMatch(/^#[0-9a-f]{6}$/i);
          }
        }
      }
    }
  });
});
