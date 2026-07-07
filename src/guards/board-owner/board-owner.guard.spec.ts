import { BoardOwnerGuard } from './board-owner.guard';

describe('BoardOwnerGuard', () => {
  it('should be defined', () => {
    expect(new BoardOwnerGuard()).toBeDefined();
  });
});
