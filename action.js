/**
 * Event action object
 * @param {string} id of action
 * @class Action
 */
const Action = function (id) {
  if (typeof id === 'undefined') {
    const timestump = new Date().getTime();
    id = timestump + '' + Math.round(Math.random() * 1000000);
  }
  let once = false;
  let enabled = true;
  let onErrorAction;
  let timeout;
  let timeoutTime;
  let actions = [];
  let remember = false;
  let tried = false;

  /**
   * @param {function} newAction to run
   * @returns {void}
   */
  this.do = (newAction) => {
    actions.push(newAction);
    return this;
  };

  this.startTimer = () => {
    startTimer();
    return this;
  };

  this.reset = (newAction) => {
    actions = [];
    enabled = true;
    tried = false;
    return this;
  };

  this.once = () => {
    once = true;
    return this;
  };

  this.disable = () => {
    enabled = false;
    clearActionTimeout();
    return this;
  };

  this.disableOnAction = (action) => {
    action.do(() => {
      this.disable();
      clearActionTimeout();
    });
    return this;
  };

  this.disableOnEvent = (event) => {
    event.action(
      new Action()
        .do(() => {
          this.disable();
          clearActionTimeout();
        }));
    return this;
  };

  this.enableOnAction = (action) => {
    action.do(() => {
      this.enable();
    });
    return this;
  };

  this.enableOnEvent = (event) => {
    event.action(
      new Action()
        .do(() => {
          this.enable();
          clearActionTimeout();
        }));
    return this;
  };

  this.getID = () => {
    return id;
  };

  this.isEnabled = () => {
    return enabled;
  };

  this.errorOnEvent = (event) => {
    event.action(
      new Action()
        .do(() => {
          onErrorAction();
        }));
    return this;
  };

  this.timeout = (time) => {
    timeoutTime = time;
    return this;
  };

  this.enable = () => {
    enabled = true;
    if (remember && tried) {
      this.run();
    }
    return this;
  };

  this.remember = () => {
    remember = true;
    return this;
  };

  this.onError = (callback) => {
    onErrorAction = callback;
    return this;
  };

  this.run = () => {
    if (enabled) {
      if (once) {
        this.disable();
      }
      clearActionTimeout();
      doAllActions();
      tried = false;
    } else {
      tried = true;
    }
    return this;
  };

  /**
   * Start action timeout
   * @returns {void}
   */
  const startTimer = () => {
    if (timeoutTime && enabled) {
      timeout = setTimeout(() => {
        this.disable();
        try {
          onErrorAction(new Error('Event timeout'));
        } catch (Err) {
          throw new Error('Event timeout');
        }
      }, timeoutTime);
    }
  };

  /**
   * Clear action timeout
   * @returns {void}
   */
  const clearActionTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  /**
   * Do all actions
   * @returns {void}
   */
  const doAllActions = () => {
    actions.forEach((action) => {
      action();
    });
  };
};
export default Action;
