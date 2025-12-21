function isNumeric(input) {
	return typeof input === 'number';
}
function calculateCylinderSideLength(sides, radius) {
	const degrees = 180;
	const radians = degrees * (Math.PI / 180);
	return Math.round(2 * radius * Math.tan(radians / sides));
}

function cylinder2D(width, height, color = 'black', innerColor = 'black', border = '1px solid black', innerWidth = 0) {
	const result = document.createElement('div');

	result.classList.add('cylinder-2d');

	result.style.position = 'relative';
	result.style.transformStyle = 'preserve-3d';
	result.style.display = 'grid';
	result.style.placeItems = 'center';

	const widthPx = isNumeric(width) ? `${width}px` : width;
	const heightPx = isNumeric(height) ? `${height}px` : height;
	const innerWidthPx = `${innerWidth / 2}px`;

	result.style.height = widthPx;

	const top = document.createElement('div');
	const bottom = document.createElement('div');
	const barrel = document.createElement('div');
	const barrel2 = document.createElement('div');

	result.style.width = widthPx;
	top.style.width = widthPx;
	top.style.height = widthPx;
	bottom.style.width = widthPx;
	bottom.style.height = widthPx;
	barrel.style.width = widthPx;
	barrel.style.height = heightPx;
	barrel2.style.width = widthPx;
	barrel2.style.height = heightPx;

	top.style.borderRadius = '9999px';
	top.style.zIndex = '5';
	bottom.style.borderRadius = '9999px';
	bottom.style.zIndex = '-5';

	top.style.backgroundImage = `radial-gradient(circle at center, ${innerColor} ${innerWidthPx}, ${color} ${innerWidthPx})`;
	bottom.style.backgroundColor = color;
	barrel.style.backgroundColor = color;
	barrel2.style.backgroundColor = color;

	top.style.position = 'absolute';
	bottom.style.position = 'absolute';
	barrel.style.position = 'absolute';
	barrel2.style.position = 'absolute';

	top.style.transform = `translateZ(calc(${heightPx} / 2))`;
	bottom.style.transform = `translateZ(calc(${heightPx} / 2 * -1))`;

	barrel.style.transform = 'rotateX(90deg)';
	barrel2.style.transform = 'rotateX(90deg) rotateY(90deg)';
	barrel2.style.filter = 'brightness(0.8)';
	barrel.style.filter = 'brightness(0.8)';
	bottom.style.filter = 'brightness(0.8)';

	// barrel.style.transform = 'translateY(-50%)';

	result.appendChild(top);
	result.appendChild(bottom);
	result.appendChild(barrel);
	result.appendChild(barrel2);

	return result;
}

function cylinder(
	width,
	height,
	sides,
	color = 'black',
	border = '1px solid black',
	innerThickness = 0,
	cap = false,
	shadowInner = 0,
	shadowBothCaps = false,
	shadowTopCap = false,
	shadowBottomCap = false,
) {
	const result = document.createElement('div');

	result.style.transformStyle = 'preserve-3d';
	result.style.display = 'grid';
	result.style.placeItems = 'center';

	const radius = width / 2;
	// +1 here in case of higher side counts will not look continuously connected
	const sideLength = calculateCylinderSideLength(sides, radius) + 1;
	const degreeStep = 360 / sides;

	for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
		const side = document.createElement('div');
		side.classList.add('cylinder__side');
		side.style.width = `${sideLength}px`;
		side.style.height = `${height}px`;
		side.style.position = 'absolute';
		side.style.backgroundColor = color;
		side.style.transform = `rotateY(${degree}deg) translateZ(${radius}px)`;
		result.appendChild(side);
	}

	// inner ring always has a cap
	if (innerThickness) {
		const thicknessRatio = Number(innerThickness);
		const holeDiameter = radius - radius * thicknessRatio;
		const thickness = radius - holeDiameter;
		for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
			const side = document.createElement('div');
			side.style.width = `${sideLength}px`;
			side.style.height = `${height}px`;
			side.style.position = 'absolute';
			side.style.backgroundColor = color;
			side.style.transform = `rotateY(${degree}deg) translateZ(${holeDiameter}px)`;

			if (shadowInner) {
				const brightnessVal = shadowInner;
				if (brightnessVal) {
					side.style.filter = `brightness(${brightnessVal})`;
				} else {
					side.style.filter = `brightness(0.7)`;
				}
			}

			side.style.borderTop = border;
			side.style.borderBottom = border;
			result.appendChild(side);
		}

		// FIXME: see if clipping a square is more efficient than appending all these elements
		// build the inner ring caps
		// for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
		// 	const top = document.createElement('div');
		// 	top.style.width = `${sideLength}px`;
		// 	top.style.height = `${thickness}px`;
		// 	top.style.position = 'absolute';
		// 	top.style.backgroundColor = color;
		// 	top.style.transformOrigin = `50% 0%`;
		// 	top.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px)`;
		// 	top.style.borderBottom = border;
		// 	if (shadowBothCaps || shadowTopCap) {
		// 		const brightnessVal = shadowBothCaps || shadowTopCap || 0.7;
		// 		top.style.filter = `brightness(${brightnessVal})`;
		// 	}
		// 	result.appendChild(top);
		//
		// 	const bottom = document.createElement('div');
		// 	bottom.style.width = `${sideLength}px`;
		// 	bottom.style.height = `${thickness}px`;
		// 	bottom.style.position = 'absolute';
		// 	bottom.style.backgroundColor = color;
		// 	bottom.style.transformOrigin = `50% 0%`;
		// 	bottom.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px) translateZ(${-height}px)`;
		// 	bottom.style.borderBottom = border;
		// 	if (shadowBothCaps || shadowBottomCap) {
		// 		const brightnessVal = shadowBothCaps || shadowBottomCap || 0.7;
		// 		bottom.style.filter = `brightness(${brightnessVal})`;
		// 	}
		//
		// 	result.appendChild(bottom);
		// }
	}

	// cap will cover inner ring if it is also applied
	if (cap) {
		for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
			const top = document.createElement('div');
			top.style.width = `${sideLength}px`;
			top.style.top = '0';
			top.style.height = `${radius}px`;
			top.style.position = 'absolute';
			top.style.backgroundColor = color;
			top.style.transformOrigin = '50% 0%';
			top.style.transform = `rotateX(90deg) rotateZ(${degree}deg)`;
			top.style.borderBottom = border;
			if (shadowBothCaps || shadowTopCap) {
				const brightnessVal = shadowBothCaps || shadowTopCap || 0.7;
				top.style.filter = `brightness(${brightnessVal})`;
			}
			result.appendChild(top);

			const bottom = document.createElement('div');
			bottom.style.width = `${sideLength}px`;
			bottom.style.height = `${radius}px`;
			bottom.style.position = 'absolute';
			bottom.style.backgroundColor = color;
			bottom.style.transformOrigin = '50% 0%';
			bottom.style.transform = `translateY(${height}px) rotateX(90deg) rotateZ(${degree}deg)`;
			bottom.style.borderBottom = border;
			if (shadowBothCaps || shadowBottomCap) {
				const brightnessVal = shadowBothCaps || shadowBottomCap || 0.7;
				bottom.style.filter = `brightness(${brightnessVal})`;
			}
			result.appendChild(bottom);
		}
	}

	return result;
}

function cube(height, width, depth, color = 'transparent', border = '1px solid black') {
	const heightPx = `${height}px`;
	const widthPx = `${width}px`;
	const depthPx = `${depth}px`;

	const result = document.createElement('div');

	result.style.transformStyle = 'preserve-3d';
	result.style.height = heightPx;
	result.style.width = widthPx;
	result.style.display = 'grid';
	result.style.placeItems = 'center';

	const faces = [];

	for (let i = 0; i < 6; i++) {
		const face = document.createElement('div');
		face.style.backgroundColor = color;
		face.style.border = border;
		face.style.position = 'absolute';
		faces.push(face);
		result.appendChild(face);
	}

	const [front, back, left, right, top, bottom] = faces;

	front.style.height = heightPx;
	front.style.width = widthPx;
	back.style.height = heightPx;
	back.style.width = widthPx;

	top.style.height = depthPx;
	top.style.width = widthPx;
	bottom.style.height = depthPx;
	bottom.style.width = widthPx;

	left.style.height = heightPx;
	left.style.width = depthPx;
	right.style.height = heightPx;
	right.style.width = depthPx;

	// we translate mid because the faces are centered from cube parent display grid
	const midWidth = width / 2;
	const midHeight = height / 2;
	const midDepth = depth / 2;

	front.classList.add('cube__face', 'cube__front');
	back.classList.add('cube__face', 'cube__back');
	left.classList.add('cube__face', 'cube__left');
	right.classList.add('cube__face', 'cube__right');
	top.classList.add('cube__face', 'cube__top');
	bottom.classList.add('cube__face', 'cube__bottom');

	front.style.transform = `translateZ(${midDepth}px)`;
	back.style.transform = `translateZ(calc(-1 * ${midDepth}px))`;
	top.style.transform = `rotateX(90deg) translateZ(${midHeight}px)`;
	bottom.style.transform = `rotateX(90deg) translateZ(calc(-1 * ${midHeight}px))`;
	right.style.transform = `rotateY(90deg) translateZ(${midWidth}px)`;
	left.style.transform = `rotateY(90deg) translateZ(calc(-1 * ${midWidth}px))`;

	return result;
}

export { cube, cylinder, cylinder2D };
