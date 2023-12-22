function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180.0)
}

function projectY(startY, length, angleDegrees) {
    return startY + length * Math.sin(degreesToRadians(angleDegrees))
}

function projectX(startX, length, angleDegrees) {
    return startX + length * Math.cos(degreesToRadians(angleDegrees))
}

function projectPoint(startX, startY, length, angleDegrees) {
    return {
        x: projectX(startX, length, angleDegrees),
        y: projectY(startY, length, angleDegrees)
    }
}

// http://www.java2s.com/example/java/2d-graphics/normalize-an-angle-so-that-it-belongs-to-the-0-360-range.html
function normalizeAngleDegrees(angleDegrees) {
    return (angleDegrees >= 0 ? angleDegrees : (360 - ((-angleDegrees) % 360))) % 360;
}
