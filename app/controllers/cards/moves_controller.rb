class Cards::MovesController < ApplicationController
  include ActionView::RecordIdentifier

  def update
    @board = current_user.boards.find(params[:board_id])
    @column = @board.columns.find(params[:column_id])
    @card = @column.cards.find(params[:card_id])

    @card.column_id = @board.columns.find(params[:target_column_id]).id
    @card.save

    render turbo_stream: [
      turbo_stream.remove(dom_id(@card)),
      turbo_stream.append(dom_id(@card.column, "cards"), partial: "cards/card", locals: { board: @board, column: @card.column, card: @card })
    ]
  end
end
