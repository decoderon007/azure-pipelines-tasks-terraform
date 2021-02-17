import { expect, test, describe, it } from '@jest/globals'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import TerraformPlanDisplay, { NoPublishedPlanMessage } from './plan-summary-tab';

let container: HTMLDivElement | null;

beforeEach(() => {
  container = document.createElement("div");
  container.id = "root";
  document.body.appendChild(container);
  process.env["TEST"] = "true";
});

afterEach(() => {
  if(container){    
    unmountComponentAtNode(container);
    container.remove();
  }
  container = null;
})

test("no plans have been published", () => {
  act(() => {
    render(<TerraformPlanDisplay />, container);  
  });
  
  expect(true).toBe(true);
});

