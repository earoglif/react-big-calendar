import React, { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import getOffset from 'dom-helpers/offset'

import useClickOutside from './hooks/useClickOutside'
import EventCell from './EventCell'
import { isSelected } from './utils/selection'

/**
 * Changes to react-overlays cause issue with auto positioning,
 * so we need to manually calculate the position of the popper,
 * and constrain it to the container.
 */
function getPosition({ target, offset, container, box }) {
  const { top, left, width, height } = getOffset(target)
  const {
    top: cTop,
    left: cLeft,
    width: cWidth,
    height: cHeight,
  } = getOffset(container)
  const { width: bWidth, height: bHeight } = getOffset(box)
  const viewBottom = cTop + cHeight
  const viewRight = cLeft + cWidth
  const bottom = top + bHeight
  const right = left + bWidth
  const { x, y } = offset
  const topOffset = bottom > viewBottom ? top - bHeight - y : top + y + height
  const leftOffset = right > viewRight ? left + x - bWidth + width : left + x

  return {
    topOffset,
    leftOffset,
  }
}

function getHeaderPosition(target) {
  const { top, left, width, height } = getOffset(target)
  return {topOffset: top, leftOffset: left}
}

function Pop({
  containerRef,
  accessors,
  getters,
  selected,
  components,
  localizer,
  position,
  show,
  events,
  slotStart,
  slotEnd,
  onSelect,
  onDoubleClick,
  onKeyPress,
  handleDragStart,
  popperRef,
  target,
  offset,
  isHeader
}) {
  useClickOutside({ ref: popperRef, callback: show })
  useLayoutEffect(() => {
    const { topOffset, leftOffset } = isHeader ?
      getHeaderPosition(target) :
      getPosition({
        target,
        offset,
        container: containerRef.current,
        box: popperRef.current,
      })
    popperRef.current.style.top = `${topOffset}px`
    popperRef.current.style.left = `${leftOffset}px`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset.x, offset.y, target])

  const { width } = position
  const style = isHeader ? {
    width: width,
    boxSizing: 'border-box',
    padding: 0
  } : {
    minWidth: width + width / 2,
  }
  return (
    <div style={style} className={`rbc-overlay ${components.showMoreProps?.popupStyleClass || ''}`} ref={popperRef}>

      {slotStart ? <div className="rbc-overlay-header">
        {localizer.format(slotStart, 'dayHeaderFormat')}
      </div> : null}
      {events.map((event, idx) => (
        <EventCell
          key={idx}
          type="popup"
          localizer={localizer}
          event={event}
          getters={getters}
          onSelect={onSelect}
          accessors={accessors}
          components={components}
          onDoubleClick={onDoubleClick}
          onKeyPress={onKeyPress}
          continuesPrior={localizer.lt(accessors.end(event), slotStart, 'day')}
          continuesAfter={localizer.gte(accessors.start(event), slotEnd, 'day')}
          slotStart={slotStart}
          slotEnd={slotEnd}
          selected={isSelected(event, selected)}
          draggable={true}
          onDragStart={() => handleDragStart(event)}
          onDragEnd={() => show()}
        />
      ))}
      {
        components.showMoreProps?.closeButtonText ?
        <button onClick={() => {show()}} className='rbc-button-link rbc-show-more'>
          {components.showMoreProps.closeButtonText}
        </button>
        : null
      }
    </div>
  )
}

const Popup = React.forwardRef((props, ref) => (
  <Pop {...props} popperRef={ref} />
))
Popup.propTypes = {
  accessors: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  selected: PropTypes.object,
  components: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  handleDragStart: PropTypes.func,
  style: PropTypes.object,
  offset: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  isHeader: PropTypes.bool
}
export default Popup
