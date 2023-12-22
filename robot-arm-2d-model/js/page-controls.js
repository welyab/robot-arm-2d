$(document).ready( function() {
    let segmentsSelect = $(SEGMENTS_SELECT_ID)
    segmentsSelect.empty()
    for(let i = 0; i < robotArm.getJointCount(); i++) {
        segmentsSelect.append(
            $("<option></option>")
                .attr("value", `${i}`)
                .text(`Joint ${i}`)
        )
    }
    $(ARM_SKIN_SELECT_ID).change(function() {
        robotArm.setShowSkin(this.checked)
    })
})
