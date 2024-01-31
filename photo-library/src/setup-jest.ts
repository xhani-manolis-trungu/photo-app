/**
 * // DON'T EVER CHANGE THE IMPORTS SEQUENCE AS IT BREAKS TESTS
 */
/**
 * // DON'T EVER CHANGE THE IMPORTS SEQUENCE AS IT BREAKS TESTS
 */
/**
 * // DON'T EVER CHANGE THE IMPORTS SEQUENCE AS IT BREAKS TESTS
 */
import 'jest-preset-angular/setup-jest';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().resetTestEnvironment();
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: false },
});
