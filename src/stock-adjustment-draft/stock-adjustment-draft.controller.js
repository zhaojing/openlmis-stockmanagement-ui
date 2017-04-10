/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function () {

  'use strict';

  /**
   * @ngdoc controller
   * @name stock-adjustment-draft.controller:StockAdjustmentDraftController
   *
   * @description
   * Controller for managing stock adjustment draft.
   */
  angular
    .module('stock-adjustment-draft')
    .controller('StockAdjustmentDraftController', controller);

  controller.$inject = ['program', 'facility'];

  function controller(program, facility) {
    var vm = this;

    /**
     * @ngdoc property
     * @propertyOf stock-adjustment-draft.controller:StockAdjustmentDraftController
     * @name program
     * @type {Object}
     *
     * @description
     * Holds current program info.
     */
    vm.program = program;

    /**
     * @ngdoc property
     * @propertyOf stock-adjustment-draft.controller:StockAdjustmentDraftController
     * @name facility
     * @type {Object}
     *
     * @description
     * Holds home facility info.
     */
    vm.facility = facility;
  }
})();
