jest.mock("../src/services/storage-service.ts", () => {
  return {
    StorageService: jest.fn().mockImplementation(() => ({
      load: jest.fn().mockReturnValue([]),
      save: jest.fn(),
      clear: jest.fn(),
    })),
  };
});

jest.mock("../src/utils/debounce.ts", () => ({
  debounce: (fn: Function) => fn,
}));

import $ from "jquery";
(global as any).$ = $;
(global as any).jQuery = $;

import { ListManager } from "../src/managers/list-manager";
import { StorageService } from "../src/services/storage-service";

describe("ListManager (essential tests)", () => {
  let $container: JQuery<HTMLElement>;
  let instance: ListManager;

  beforeEach(() => {
    document.body.innerHTML = `<div id="test-container"></div>`;
    $container = $("#test-container");

    (StorageService as jest.Mock).mockClear();
  });

  it("throws if container not found", () => {
    expect(() => new ListManager("missing")).toThrow();
  });

  it("renders UI and loads from storage", () => {
    instance = new ListManager("test-container");
    expect($container.find("#item-input").length).toBe(1);

    expect(StorageService).toHaveBeenCalledTimes(1);
  });

  it("adds item and clears input", () => {
    instance = new ListManager("test-container");

    instance["$input"].val("Test");
    $container.find("#add-button").trigger("click");

    expect($container.find("li").length).toBe(1);
    expect(instance["$input"].val()).toBe("");
  });

  it("removes item on .remove-item click", () => {
    instance = new ListManager("test-container");

    instance["$input"].val("Test");
    $container.find("#add-button").trigger("click");
    expect($container.find("li").length).toBe(1);

    $container.find(".remove-item").trigger("click");
    expect($container.find("li").length).toBe(0);
  });

  it("clears all items and storage", () => {
    instance = new ListManager("test-container");

    instance["$input"].val("Test");
    $container.find("#add-button").trigger("click");

    $container.find("#remove-button").trigger("click");

    expect($container.find("li").length).toBe(0);
  });
});
