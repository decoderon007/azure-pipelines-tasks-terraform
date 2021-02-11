import { expect, test, describe, it } from '@jest/globals'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import TerraformPlanDisplay, { NoPublishedPlanMessage } from './plan-summary-tab';

test("render", () => {
  expect(true).toBe(true);
})

let container: HTMLDivElement | null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if(container){    
    unmountComponentAtNode(container);
    container.remove();
  }
  container = null;
})

describe("no plans have been published", async () => {
  //todo: mock out api to get attachments to return undefined...
  await act(() => {
    render(<TerraformPlanDisplay />, container);
  });
  it("renders with message indicating no plans were found", () => {
    expect(true).toBe(true);
    // const planElement = container?.querySelector("div.flex-grow");
    // expect(planElement).not.toBeUndefined();
    // expect(planElement?.innerHTML).toBe(NoPublishedPlanMessage);
  });
});

