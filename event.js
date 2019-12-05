/**
 * Event object
 * @param {object} core Core instance.
 * @returns {void}
 */
const Event = function (core) {
  const listeners = {};

  /**
   * @param {function} action function
   * @returns {void}
   */
  this.action = (action) => {
    if (typeof listeners[action.getID()] !== 'undefined') {
      const logger = core.getComponent('logger');
      logger.log({
        message: 'DUPLICATE ACTION: ' + action.getID(),
        type: 'warning',
        component: 'eventManager',
        method: 'event.js > this.action()'
      });
    }

    /**
     * All duplicated actions will be overwritten
     */
    listeners[action.getID()] = action;
    return this;
  };

  /**
   * @returns {void}
   */
  this.reached = () => {
    Object.entries(listeners).forEach((listener) => {
      listener[1].run();
    });

    return this;
  };
};

export default Event;
