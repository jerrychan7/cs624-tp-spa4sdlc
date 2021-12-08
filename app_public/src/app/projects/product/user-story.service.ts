import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CardStatus } from 'src/app/Types';
import { BoardsService } from '../add-or-edit-board/boards.service';
// import { ProjectsService } from '../projects.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoryService {

  constructor(
    private api: ApiService,
    private boardService: BoardsService,
  ) { }

  currentPrjId: string | any;
  setCurrentPrjId(prjId: string | any) {
    this.currentPrjId = prjId;
  }
  currentBoardId: string | any;
  setCurrentBoardId(board: string | any) {
    this.currentBoardId = board;
  }

  async insertCard(cardInfo: any = {}) {
    const [th, tm] = cardInfo.totalTime.split(":").map((s: any) => Number(s) || 0),
          totalTime = ((th || 0) * 60 + (tm || 0)) * 60;
    if (!this.currentPrjId || !this.currentBoardId) return "connot get id";
    let boardId = cardInfo.boardId || this.currentBoardId;
    const board = this.boardService.boards?.find(b => b._id == boardId);
    if (!board) return "connot get board";
    let card = await this.api.makeApiCall("post", `prj/${this.currentPrjId}/board/${this.currentBoardId}/card`, {
      body: {
        boardId,
        title: cardInfo.title,
        subTitle: cardInfo.subTitle,
        content: cardInfo.content,
        totalTime,
        status: CardStatus.STOP,
      }
    });
    board.cards?.push(card);
    this.boardService.initBoard(board);
    return card;
  }

  async modifyCard(cardInfo: any = {}) {
    // console.log(cardInfo);
    if (cardInfo.totalTime) {
      const [th, tm] = (cardInfo.totalTime || "1:0").split(":").map((s: any) => Number(s) || 0);
      cardInfo.totalTime = ((th || 0) * 60 + (tm || 0)) * 60;
    }
    if (!this.currentPrjId || !this.currentBoardId) return "connot get id";

    const oldBoardId = this.currentBoardId;
    const newBoardId = cardInfo.boardId || this.currentBoardId;

    let card = await this.api.makeApiCall("put", `prj/${this.currentPrjId}/board/${oldBoardId}/card/${cardInfo._id}`, {
      body: cardInfo
    });
    const oldBoard = this.boardService.boards?.find(b => b._id == oldBoardId);
    const newBoard = oldBoardId == newBoardId? oldBoard: this.boardService.boards?.find(b => b._id == newBoardId);
    let i = oldBoard?.cards?.findIndex(c => c._id == cardInfo._id) ?? -1;
    if (i != -1) oldBoard?.cards?.splice(i, 1);
    newBoard?.cards?.push(card);
    this.boardService.initBoard(newBoard);
    return card;
  }

  async removeCard(cardInfo: any) {
    if (!this.currentPrjId || !this.currentBoardId) return "connot get id";
    let boardId = cardInfo.boardId || this.currentBoardId;
    const board = this.boardService.boards?.find(b => b._id == boardId);
    if (!board) return "connot get board";
    await this.api.makeApiCall("delete", `prj/${this.currentPrjId}/board/${this.currentBoardId}/card/${cardInfo._id}`);
    let i = board.cards?.findIndex(c => c._id == cardInfo._id) ?? -1;
    if (i != -1) board.cards?.splice(i, 1);
    this.boardService.initBoard(board);
    return "";
  }

}
