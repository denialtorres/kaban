class CardsController < ApplicationController
  include ActionView::RecordIdentifier

  def new
    @board = current_user.boards.find(params[:board_id])
    @column = @board.columns.find(params[:column_id])
    @card = @column.cards.new
  end

  def create
    @board = current_user.boards.find(params[:board_id])
    @column = @board.columns.find(params[:column_id])
    @card = @column.cards.new(card_params)

    if @card.save
      render turbo_stream: [
        turbo_stream.append(dom_id(@column, "cards"), partial: "cards/card", locals: { board: @board, column: @column, card: @card }),
        turbo_stream.replace(dom_id(@column, "cards_new"), partial: "cards/new_link", locals: { board: @board, column: @column })
      ]
    else
      turbo_stream.replace(dom_id(@column, "cards_new"), partial: "cards/new_link", locals: { board: @board, column: @column })
    end
  end

  private

  def card_params
    params.require(:card).permit(:name, :description)
  end
end
