import { ItemComponent } from "../components/item-component";
import { StorageService } from "../services/storage-service";
import { debounce } from "../utils/debounce";

export class ListManager {
  private readonly $container: JQuery<HTMLElement>;
  private $input!: JQuery<HTMLInputElement>;
  private $list!: JQuery<HTMLElement>;
  private readonly storage: StorageService;

  constructor(containerId: string, storageKey: string = "list-items") {
    const container = $(`#${containerId}`);
    if (container.length === 0)
      throw new Error(`Container with ID "${containerId}" not found`);

    this.$container = container;
    this.storage = new StorageService(storageKey);

    this.renderUI();
    this.attachEvents();
    this.loadFromStorage();
  }

  private renderUI(): void {
    this.$container.html(`
      <h2>Dynamic List Manager</h2>
      <div class="input-group">
        <input type="text" id="item-input" placeholder="Enter new item" autocomplete="off" />
        <button id="add-button" type="button">Add Item</button>
      </div>
      <ul id="item-list" aria-label="List of items"></ul>
      <div class="list-footer">
        <button id="remove-button" type="button">Clear All</button>
      </div>
    `);

    this.$input = this.$container.find<HTMLInputElement>("#item-input");
    this.$list = this.$container.find<HTMLElement>("#item-list");
  }

  private attachEvents(): void {
    const debouncedAdd = debounce(() => this.addItem(), 100);

    this.$container.on("click", "#add-button", debouncedAdd);

    this.$input.on("keypress", (event: JQuery.KeyPressEvent) => {
      if (event.which === 13) {
        debouncedAdd();
      }
    });

    this.$list.on("click", ".remove-item", (event: JQuery.ClickEvent) => {
      this.handleRemoveItem(event);
    });

    this.$container.on("click", "#remove-button", () => this.clear());
  }

  private handleRemoveItem(event: JQuery.ClickEvent): void {
    $(event.currentTarget).closest("li").remove();
    this.saveToStorage();
  }

  private addItem(): void {
    const value = this.$input.val()?.toString().trim();
    if (!value) return;

    const $item = new ItemComponent(value).render();
    this.$list.prepend($item);
    this.$input.val("");
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    const items = this.storage.load();
    for (const text of items) {
      const $item = new ItemComponent(text).render();
      this.$list.append($item);
    }
  }

  private saveToStorage(): void {
    const items = this.getItems();
    this.storage.save(items);
  }

  public getItems(): string[] {
    return this.$list
      .find("li")
      .map((_, el) => ItemComponent.extractText($(el)))
      .get();
  }

  public clear(): void {
    this.$list.empty();
    this.storage.clear();
  }
}
