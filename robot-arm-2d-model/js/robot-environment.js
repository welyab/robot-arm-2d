const DEFAULT_STROKE_WIDTH = 1

const BASE_WIDTH = 200
const BASE_HEIGHT = 30
const BASE_FILL_COLOR = "#A0A0A0"
const BASE_STROKE_COLOR = "#808080"
const BASE_STROKE_WIDTH = 4

const PEDESTAL_WIDTH = 30
const PEDESTAL_HEIGHT = 40
const PEDESTAL_FILL_COLOR = BASE_FILL_COLOR
const PEDESTAL_STROKE_COLOR = BASE_STROKE_COLOR
const PEDESTAL_STROKE_WIDTH = BASE_STROKE_WIDTH

const ARROW_UP_KEY_CODE = 38
const ARROW_DOWN_KEY_CODE = 40

let angularVelocity = 120.0

class EventInspector {

    constructor() {
        this.arrowUpKeyPressed = false
        this.arrowDownKeyPressed = false

        $(document).keyup((function(e){
            if (e.keyCode == ARROW_UP_KEY_CODE) this.arrowUpKeyPressed = false
            if (e.keyCode == ARROW_DOWN_KEY_CODE) this.arrowDownKeyPressed = false
        }).bind(this))
        $(document).keydown((function(e){
            if (e.keyCode == ARROW_UP_KEY_CODE) this.arrowUpKeyPressed = true
            if (e.keyCode == ARROW_DOWN_KEY_CODE) this.arrowDownKeyPressed = true
        }).bind(this))
    }

    isArrowUpKeyPressed() {
        return this.arrowUpKeyPressed
    }

    isArrowDownKeyPressed() {
        return this.arrowDownKeyPressed
    }
}

let eventInspector = new EventInspector()

let canvas = new fabric.Canvas('robot-arm-canvas', {
    selection: false,
    preserveObjectStacking: true
})

let base = new fabric.Rect({
    left: canvas.getWidth() / 2.0 - BASE_WIDTH / 2.0,
    top: canvas.getHeight() - BASE_HEIGHT,
    rx: 5,
    ry: 5,
    fill: BASE_FILL_COLOR,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    objectCaching: false,
    stroke: BASE_STROKE_COLOR,
    strokeWidth: BASE_STROKE_WIDTH,
    selectable: false,
})

let pedestal = new fabric.Rect({
    left: canvas.getWidth() / 2.0 - PEDESTAL_WIDTH / 2.0,
    top: canvas.getHeight() - BASE_HEIGHT - PEDESTAL_HEIGHT,
    fill: PEDESTAL_FILL_COLOR,
    width: PEDESTAL_WIDTH,
    height: PEDESTAL_HEIGHT,
    objectCaching: false,
    stroke: PEDESTAL_STROKE_COLOR,
    strokeWidth: PEDESTAL_STROKE_WIDTH,
    selectable: false,
})

canvas.add(base)
canvas.add(pedestal)

let origin = new fabric.Point(
    pedestal.left,
    pedestal.top,
)

let circle = new fabric.Circle({
    left: origin.x + PEDESTAL_WIDTH / 2.0,
    top: origin.y,
    radius: 4,
    fill: "red",
    stroke: "black",
    originX: "center",
    originY: "center",
})

canvas.add(circle)

let robotArm = new RobotArm({
    firstJointX: circle.left,
    firstJointY: circle.top,
    segments: [
        {
            segmentLength: 200,
            segmentAngleDegrees: -0.0
        },
        {
            segmentLength: 200,
            segmentAngleDegrees: -45.0
        },
        {
            segmentLength: 200,
            segmentAngleDegrees: -45.0
        }
    ],
    showSkin: true
})

function gameLoop(timeDetalMillis) {
    let incrementalAngle = (angularVelocity * timeDetalMillis) / 1000.0
    if(eventInspector.isArrowUpKeyPressed()) {
        incrementalAngle = incrementalAngle * -1
    } else if(!eventInspector.isArrowDownKeyPressed()) {
        incrementalAngle = 0
    }
    robotArm.addSegmentAngleDegrees(
        parseInt($(SEGMENTS_SELECT_ID).find(":selected").val() || "0"),
        {
            segmentDeltaAngleDegrees: incrementalAngle
        }
    )
}

(function() {
    let prevTime = performance.timeOrigin + performance.now()
    function _gameLoop() {
        let currentTime = performance.timeOrigin + performance.now()
        let timeDelta = currentTime - prevTime
        prevTime = currentTime
        gameLoop(timeDelta)
        fabric.util.requestAnimFrame(_gameLoop, canvas.getElement())
        canvas.renderAll()
    }
    fabric.util.requestAnimFrame(_gameLoop, canvas.getElement())
})()
