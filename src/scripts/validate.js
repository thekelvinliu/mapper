'use strict';

const validate = () =>
  (/^[a-zA-Z0-9]+$/.test(document.forms['register']['user'].value))
    ? true : false;
