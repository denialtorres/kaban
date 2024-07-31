import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="kanban-board"
export default class extends Controller {
  static targets = ["column", "card"];

  connect() {
    this.initializeDraggableCards();
    this.initializeDroppableColumns();
  }

  cardTargetConnected(card) {
    this.makeCardDraggable(card);
  }

  initializeDraggableCards() {
    this.cardTargets.forEach((card) => {
      this.makeCardDraggable(card);
    });
  }

  makeCardDraggable(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (event) => this.handleDragStart(event));
    card.addEventListener("dragend", () => this.handleDragEnd());
  }

  initializeDroppableColumns() {
    this.columnTargets.forEach((column) => {
      column.addEventListener("dragover", (event) =>
        this.handleDragOver(event),
      );
      column.addEventListener("drop", (event) => this.handleDrop(event));
    });
  }

  handleDragStart(event) {
    event.dataTransfer.setData("boardId", event.target.dataset.boardId);
    event.dataTransfer.setData("columnId", event.target.dataset.columnId);
    event.dataTransfer.setData("cardId", event.target.dataset.cardId);
    event.target.classList.add("is-dragging");
  }

  handleDragEnd() {
    // event.target.classList.remove("is-dragging")
    this.cardTargets.forEach((card) => {
      card.classList.remove("is-dragging");
    });
  }

  handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("is-dragging-over");
  }

  handleDrop(event) {
    event.preventDefault();
    const targetColumnId = event.currentTarget.dataset.columnId;
    const boardId = event.dataTransfer.getData("boardId");
    const columnId = event.dataTransfer.getData("columnId");
    const cardId = event.dataTransfer.getData("cardId");

    fetch(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/vnd.turbo-stream.html",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          .content,
      },
      body: JSON.stringify({ target_column_id: targetColumnId }),
    })
      .then((response) => response.text())
      .then((html) => Turbo.renderStreamMessage(html));
  }
}
