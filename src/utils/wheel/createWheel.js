import { wheelConfig } from './config';
import { createSectorWithStraightGaps } from './createSector';

export const createWheel = (svgRef) => {
  const svg = svgRef.current;
  if (!svg) return;

  // Clear existing content
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const { centerX, centerY, outerRadius, innerRadius, slots, gapWidth, cornerRadius, prizes } = wheelConfig;

  // Create defs element
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);

  // Create donut frame with new dark theme
  const donutFrame = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const donutOuterRadius = outerRadius + 10;
  const donutInnerRadius = innerRadius - 10;
  
  const donutPath = `
    M ${centerX - donutOuterRadius}, ${centerY}
    a ${donutOuterRadius},${donutOuterRadius} 0 1,0 ${donutOuterRadius * 2},0
    a ${donutOuterRadius},${donutOuterRadius} 0 1,0 -${donutOuterRadius * 2},0
    M ${centerX - donutInnerRadius}, ${centerY}
    a ${donutInnerRadius},${donutInnerRadius} 0 1,0 ${donutInnerRadius * 2},0
    a ${donutInnerRadius},${donutInnerRadius} 0 1,0 -${donutInnerRadius * 2},0
    Z
  `;
  
  donutFrame.setAttribute('d', donutPath);
  donutFrame.setAttribute('fill', '#0a0a0b');
  donutFrame.setAttribute('fill-rule', 'evenodd');
  donutFrame.setAttribute('stroke', '#1a1a1d');
  donutFrame.setAttribute('stroke-width', '2');
  svg.appendChild(donutFrame);

  // Create glow filter
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'slot-glow');
  filter.setAttribute('x', '-200%');
  filter.setAttribute('y', '-200%');
  filter.setAttribute('width', '400%');
  filter.setAttribute('height', '400%');

  const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', '20');

  filter.appendChild(blur);
  defs.appendChild(filter);

  // Create slots
  for (let i = 0; i < slots; i++) {
    const slotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    slotGroup.classList.add('slot');
    slotGroup.setAttribute('data-slot', i.toString());

    const prize = prizes[i];
    
    // New color scheme based on rarity/multiplier
    let strokeColor = '#3f3f46'; // default gray
    
    if (prize.type === 'boost') {
      strokeColor = '#F59E0B'; // gold for boost
    } else if (prize.multiplier >= 10) {
      strokeColor = '#F59E0B'; // gold for legendary
    } else if (prize.multiplier >= 4) {
      strokeColor = '#8B5CF6'; // purple for epic
    } else if (prize.multiplier >= 2) {
      strokeColor = '#2AABEE'; // blue for rare  
    } else if (prize.multiplier >= 1) {
      strokeColor = '#52525b'; // dark gray for common
    } else {
      strokeColor = '#3f3f46'; // very dark for lowest
    }

    const angleStep = (2 * Math.PI) / slots;
    const centerAngle = i * angleStep - Math.PI / 2;
    const slotHeight = outerRadius - innerRadius;
    const slotWidth = (2 * Math.PI * outerRadius / slots) - gapWidth;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', createSectorWithStraightGaps(
      centerX,
      centerY,
      innerRadius + 1.5,
      outerRadius - 1.5,
      i,
      slots,
      gapWidth,
      cornerRadius
    ));
    path.setAttribute('fill', '#18181b');
    path.setAttribute('stroke', 'none');
    slotGroup.appendChild(path);

    // Create mask and gradient for glow
    const maskId = `slot-mask-${i}`;
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', maskId);

    const maskShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    maskShape.setAttribute('d', path.getAttribute('d'));
    maskShape.setAttribute('fill', 'white');
    mask.appendChild(maskShape);
    defs.appendChild(mask);

    const gradientId = `glow-gradient-${i}`;
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '50%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', strokeColor);
    stop1.setAttribute('stop-opacity', '0.8');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '60%');
    stop2.setAttribute('stop-color', strokeColor);
    stop2.setAttribute('stop-opacity', '0.2');

    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', strokeColor);
    stop3.setAttribute('stop-opacity', '0');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);

    // Glow effect
    const maskedGlow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    maskedGlow.setAttribute('mask', `url(#${maskId})`);
    
    const glowDistance = innerRadius + slotHeight * 0.75;
    const glowCenterX = centerX + (glowDistance * Math.cos(centerAngle));
    const glowCenterY = centerY + (glowDistance * Math.sin(centerAngle));

    const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glowCircle.setAttribute('cx', glowCenterX);
    glowCircle.setAttribute('cy', glowCenterY);
    glowCircle.setAttribute('r', slotHeight * 0.55);
    glowCircle.setAttribute('fill', `url(#${gradientId})`);
    glowCircle.setAttribute('filter', 'url(#slot-glow)');
    glowCircle.setAttribute('opacity', '0.6');

    maskedGlow.appendChild(glowCircle);
    slotGroup.appendChild(maskedGlow);

    // Stroke overlay
    const strokeOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    strokeOverlay.setAttribute('d', path.getAttribute('d'));
    strokeOverlay.setAttribute('fill', 'none');
    strokeOverlay.setAttribute('stroke', strokeColor);
    strokeOverlay.setAttribute('stroke-width', '1.5');
    strokeOverlay.setAttribute('stroke-opacity', '0.6');
    strokeOverlay.setAttribute('pointer-events', 'none');
    slotGroup.appendChild(strokeOverlay);

    // Bottom rectangle indicator
    const rectWidth = slotWidth / 2.2;
    const rectHeight = slotHeight / 30;
    const centerDistance = innerRadius + slotHeight - rectHeight * 1.8;
    const offset = 4;
    const rectCenterX = centerX + (centerDistance * Math.cos(centerAngle)) + offset * Math.cos(centerAngle);
    const rectCenterY = centerY + (centerDistance * Math.sin(centerAngle)) + offset * Math.sin(centerAngle);

    const bottomRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bottomRect.setAttribute('x', rectCenterX - rectWidth / 2);
    bottomRect.setAttribute('y', rectCenterY - rectHeight / 2);
    bottomRect.setAttribute('width', rectWidth);
    bottomRect.setAttribute('height', rectHeight);
    bottomRect.setAttribute('rx', '3');
    bottomRect.setAttribute('ry', '3');
    bottomRect.setAttribute('fill', strokeColor);
    bottomRect.setAttribute('opacity', '0.8');

    const angleDeg = (centerAngle * 180) / Math.PI + 90;
    bottomRect.setAttribute('transform', `rotate(${angleDeg} ${rectCenterX} ${rectCenterY})`);
    slotGroup.appendChild(bottomRect);

    // Image and text positions
    const textRadius = (outerRadius + innerRadius) / 2;
    const imageX = centerX + (textRadius + 22) * Math.cos(centerAngle);
    const imageY = centerY + (textRadius + 22) * Math.sin(centerAngle);
    const textX = centerX + (textRadius - 52) * Math.cos(centerAngle);
    const textY = centerY + (textRadius - 52) * Math.sin(centerAngle);
    const textRotationAngle = (centerAngle * 180 / Math.PI) + 90 + 180;

    // Image group
    const imageGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    imageGroup.setAttribute('transform', `rotate(${textRotationAngle} ${imageX} ${imageY})`);

    const imageSize = 90; 
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('x', imageX - imageSize/2);
    image.setAttribute('y', imageY - imageSize/2);
    image.setAttribute('width', imageSize.toString());
    image.setAttribute('height', imageSize.toString());
    image.setAttribute('href', `/assets/svg/${prize.image}`);
    image.setAttribute('class', 'slot-image');
    imageGroup.appendChild(image);

    // Text group
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('transform', `rotate(${textRotationAngle} ${textX} ${textY})`);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.classList.add('slot-text');
    text.setAttribute('x', textX);
    text.setAttribute('y', textY);
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('font-size', '16');
    text.setAttribute('font-weight', '700');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = prize.value;
    textGroup.appendChild(text);

    slotGroup.appendChild(imageGroup);
    slotGroup.appendChild(textGroup);

    svg.appendChild(slotGroup);
  }
};
