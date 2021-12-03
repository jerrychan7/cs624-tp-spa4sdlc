import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UserStoryService {

  constructor() { }

  currentPrjId: string | any;
  setCurrentPrj(prjId: string | any) {
    this.currentPrjId = prjId;
  }
  currentBoard: string | any;
  setCurrentBoard(board: string | any) {
    this.currentBoard = board;
  }
  currentCard: string | any;
  setCurrentCard(card?: any | undefined) {
    this.currentCard = card;
    this.populateForm(card);
  }

  currentCardFrom = new FormGroup({
    id: new FormControl(null),
    boardId: new FormControl(null),
    title: new FormControl(""),
    subTitle: new FormControl(""),
    content: new FormControl(""),
    totalTime: new FormControl(""),
  });

  createOrModifyCard(card = this.currentCardFrom.value) {
    if (this.currentCardFrom.controls["id"].value)
      return this.modifyCard(card);
    return this.insertCard(card);
  }

  initializeFormGroup() {
    this.populateForm();
  }

  populateForm(card:any = {}) {
    this.currentCardFrom.reset();
    card.totalTime = card.totalTime || 0;
    const th = Math.floor(card.totalTime / 60 / 60),
          tm = Math.floor(card.totalTime / 60) - th * 60;
    this.currentCardFrom.setValue({
      id: card.id || null,
      boardId: card.boardId || this.currentBoard?.id || null,
      title: card.title || "",
      subTitle: card.subTitle || "",
      content: card.content || "",
      totalTime: (card.totalTime? th + " : " + tm: ""),
    });
  }

  async insertCard(card = this.currentCardFrom.value) {
    const [th, tm] = card.totalTime.split(":").map((s: any) => Number(s) || 0),
          totalTime = ((th || 0) * 60 + (tm || 0)) * 60;
    // await this.api.CreateCard({
    //   boardId: card.boardId || this.currentBoard.id,
    //   title: card.title,
    //   subTitle: card.subTitle,
    //   content: card.content,
    //   totalTime,
    //   status: CardStatus.stop,
    // });
  }

  async modifyCard(card = this.currentCardFrom.value) {
    if (card.title != this.currentCard.title
      || card.subTitle != this.currentCard.subTitle
      || card.content != this.currentCard.content
      || card.totalTime != this.currentCard.totalTime) {
      const [th, tm] = card.totalTime.split(":").map((s: any) => Number(s) || 0),
            totalTime = ((th || 0) * 60 + (tm || 0)) * 60;
      // await this.api.UpdateCard({
      //   id: this.currentCard.id,
      //   title: card.title,
      //   subTitle: card.subTitle,
      //   content: card.content,
      //   totalTime,
      // });
    }
    return "";
  }

  async removeCard(card: any) {
    // await this.api.DeleteCard({
    //   id: card.id
    // });
  }

}
