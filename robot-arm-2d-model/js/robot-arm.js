class ArmSegment {
    constructor({
        segmentJointX,
        segmentJointY,
        segmentLength,
        segmentAngleDegrees,
        accumulatedSegmentsAngleDegrees,
        showSkin
    }) {
        this.setSegmentLength(segmentLength)
        this.line = new fabric.Line(
            [0, 0, 0, 0],
            {
                stroke: "red",
                selectable: false,
            }
        )
        this.jointSkin = new fabric.Circle({
            left: this.line.x1,
            top: this.line.y1,
            radius: 18,
            fill: "white",
            stroke: "#383838",
            strokeWidth: 4,
            originX: "center",
            originY: "center",
            visible: showSkin,
            selectable: false,
        })
        this.segmentSkin = new fabric.Rect({
            left: this.line.x1,
            top: this.line.y1,
            width: this.segmentLength,
            height: 14,
            fill: "282828",
            stroke: "#383838",
            strokeWidth: 3,
            originY: "center",
            visible: showSkin,
            angle: this.accumulatedSegmentsAngleDegrees + this.segmentAngleDegrees,
        })

        canvas.add(this.line)
        canvas.add(this.jointSkin)
        canvas.add(this.segmentSkin)

        this.setPose({
            segmentJointX: segmentJointX,
            segmentJointY: segmentJointY,
            segmentAngleDegrees: segmentAngleDegrees,
            accumulatedSegmentsAngleDegrees: accumulatedSegmentsAngleDegrees
        })
    }

    getSegmentLength() {
        return this.segmentLength
    }

    setSegmentLength(segmentLength) {
        this.segmentLength = segmentLength
    }

    setShowSkin(showSkin) {
        this.segmentSkin.visible = showSkin
        this.jointSkin.visible = showSkin
    }

    getJointX() {
        return this.line.x1
    }

    getJointY() {
        return this.line.y1
    }

    getEndX() {
        return this.line.x2
    }

    getEndY() {
        return this.line.y2
    }

    getSegmentAngleDegrees() {
        return this.segmentAngleDegrees
    }

    getAccumulatedSegmentsAngleDegrees() {
        return this.accumulatedSegmentsAngleDegrees
    }

    getSegmentRealAngleDegress() {
        return this.getSegmentAngleDegrees() + this.getAccumulatedSegmentsAngleDegrees()
    }

    setAngleDegrees({
        segmentAngleDegrees,
        accumulatedSegmentsAngleDegrees
    }) {
        this.setPose({
            segmentJointX: this.line.x1,
            segmentJointY: this.line.y1,
            segmentAngleDegrees: segmentAngleDegrees,
            accumulatedSegmentsAngleDegrees: accumulatedSegmentsAngleDegrees
        })
    }

    setPose({
        segmentJointX,
        segmentJointY,
        segmentAngleDegrees,
        accumulatedSegmentsAngleDegrees
    }) {
        this.segmentAngleDegrees = normalizeAngleDegrees(segmentAngleDegrees)
        this.accumulatedSegmentsAngleDegrees = normalizeAngleDegrees(accumulatedSegmentsAngleDegrees)
        
        this.line.set({
            x1: segmentJointX,
            y1: segmentJointY,
            x2: segmentJointX + projectX(0, this.segmentLength, this.segmentAngleDegrees + this.accumulatedSegmentsAngleDegrees),
            y2: segmentJointY + projectY(0, this.segmentLength, this.segmentAngleDegrees + this.accumulatedSegmentsAngleDegrees),
        })

        this.jointSkin.left = this.line.x1
        this.jointSkin.top = this.line.y1
        this.segmentSkin.left = this.line.x1
        this.segmentSkin.top = this.line.y1
        this.segmentSkin.angle = this.accumulatedSegmentsAngleDegrees + this.segmentAngleDegrees
    }
}

/**
 * segments = {
 *  segmentLength
 *  segmentAngleDegrees
 * }
 */
class RobotArm {
    constructor ({
        firstJointX,
        firstJointY,
        showSkin,
        segments,
    }) {
        segments = [...segments]
        // the end effector
        segments[segments.length] = {
            segmentLength: 60,
            segmentAngleDegrees: 0
        }

        this.showSkin = showSkin
        this.segments = []
        let segmentOriginX = firstJointX
        let segmentOriginY = firstJointY
        let accumulatedAngleDegress = 0
        for(let i = 0; i < segments.length; i++) {
            this.segments[i] = new ArmSegment({
                elementIndex: 0,
                skinIndex: 100,
                segmentJointX: segmentOriginX,
                segmentJointY: segmentOriginY,
                segmentLength: segments[i].segmentLength,
                segmentAngleDegrees: segments[i].segmentAngleDegrees,
                accumulatedSegmentsAngleDegrees: accumulatedAngleDegress,
                showSkin: showSkin,
            })
            accumulatedAngleDegress += segments[i].segmentAngleDegrees
            segmentOriginX = this.segments[i].getEndX()
            segmentOriginY = this.segments[i].getEndY()
        }

        let objectIndex = 1000
        for(let i = 0; i < segments.length; i++) {
            this.segments[i].line.moveTo(objectIndex)
            objectIndex++
        }
        for(let i = 0; i < segments.length; i++) {
            this.segments[i].segmentSkin.moveTo(objectIndex)
            objectIndex++
        }
        for(let i = 0; i < segments.length; i++) {
            this.segments[i].jointSkin.moveTo(objectIndex)
            objectIndex++
        }
    }

    getShowSkin() {
        return this.showSkin
    }

    setShowSkin(showSkin) {
        for(let i = 0; i < this.segments.length; i++) {
            this.segments[i].setShowSkin(showSkin)
        }
        this.showSking = showSkin
    }

    getJointCount() {
        return this.segments.length
    }

    getSegmentsCount() {
        return this.segments.length
    }

    /**
     * opts = {
     *   segmentDeltaAngleDegrees
     * }
     */
    addSegmentAngleDegrees(
        segmentIndex,
        opts,
    ) {
        this.setSegmentAngleDegrees(
            segmentIndex,
            {
                segmentAngleDegrees: opts.segmentDeltaAngleDegrees + this.segments[segmentIndex].getSegmentAngleDegrees()
            }  
        )
    }

    /**
     * opts = {
     *   segmentAngleDegrees
     * }
     */
    setSegmentAngleDegrees(
        segmentIndex,
        opts,
    ) {
        let accumulatedSegmentsAngleDegrees = 0
        if(segmentIndex - 1 >= 0) {
            accumulatedSegmentsAngleDegrees = this.segments[segmentIndex - 1].segmentAngleDegrees
                + this.segments[segmentIndex - 1].accumulatedSegmentsAngleDegrees
        }
        this.segments[segmentIndex].setAngleDegrees({
            segmentAngleDegrees: opts.segmentAngleDegrees,
            accumulatedSegmentsAngleDegrees: accumulatedSegmentsAngleDegrees
        })
        for(let i = segmentIndex + 1; i < this.segments.length; i++) {
            this.segments[i].setPose({
                segmentJointX: this.segments[i - 1].getEndX(),
                segmentJointY: this.segments[i - 1].getEndY(),
                segmentAngleDegrees: this.segments[i].getSegmentAngleDegrees(),
                accumulatedSegmentsAngleDegrees: this.segments[i - 1].getSegmentRealAngleDegress(),
            })
        }
    }
}
