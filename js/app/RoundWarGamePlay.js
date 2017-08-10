/*global define */
define('RoundWarGamePlay', ['GamePlay', 'Player', 'Tools', 'GameSession'], function (GamePlay, Player, Tools, GameSession) {

    'use strict';

    var WAITING_TO_GATHER_CARDS = 0;
    var WAITING_TO_FILL_TABLE = 1;
    var WAITING_FOR_FACE_DOWN_WAR_CARD = 2;
    var GAME_OVER = 3;

    var RoundWarGamePlay = function (nNumPlayers, aCards, aSounds, aPlayerNames, nMaxNumberOfSlots, nCardWidth, oCallbacks) {

        GamePlay.call(this, nNumPlayers, aCards, aSounds, aPlayerNames, nMaxNumberOfSlots, nCardWidth, oCallbacks);

    };

    // inherits from GamePlay
    RoundWarGamePlay.prototype = Object.create(GamePlay.prototype);

    /**
     * Compares two values in round fashion.
     *
     * Returns true if value 1 is the higher value, unless one value 2 is the
     * lowest and value 1 is highest.
     */
    RoundWarGamePlay.roundCompare = function (value1, value2) {
        if (value1 === 1 && value2 === 6) {
            return true;
        } else if (value1 === 6 && value2 === 1) {
            return false;
        } else if (value1 > value2) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Indicates who won the hand, based on the two players' cards.
     *
     * @param aPlayerControllers an array of players
     *
     * @return number of the player who won, or -1 if it's a tie
     */
    RoundWarGamePlay.prototype.whoWonTheHand = function (aPlayerControllers) {

        var nWinningPlayer = -1;

        if (RoundWarGamePlay.roundCompare(aPlayerControllers[0].getTableCard().value, aPlayerControllers[1].getTableCard().value)) {
            nWinningPlayer = 0;
        } else if (RoundWarGamePlay.roundCompare(aPlayerControllers[1].getTableCard().value, aPlayerControllers[0].getTableCard().value)) {
            nWinningPlayer = 1;
        }

        return nWinningPlayer;
    };

    /**
     * checks if one player has won
     */
    RoundWarGamePlay.prototype.isGameFinished = function () {

        var i, nOtherPlayer;

        for (i = 0; i < this.playerControllers.length; i++) {

            // checks if the player's hand is empty
            if (this.playerControllers[i].hand.length === 0) {

                if (i === 0) {
                    nOtherPlayer = 1;
                } else if (i === 1) {
                    nOtherPlayer = 0;
                }

                // checks if the same player's table loses to the other player
                if (this.playerControllers[i].getTableCard().value < this.playerControllers[nOtherPlayer].getTableCard().value) {

                    this.result = this.playerControllers[nOtherPlayer].getName() + ' wins';
                    this.callbacks.renderResult(this.result);
                    this.state = GAME_OVER;
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * makes a Player controller to manage a player locally
     *
     * @param nPlayerNum player number
     * @param aPlayers the list of players to add the player to
     * @param oPlayerRef a reference to the remote player
     * @param fnLocalPlayerWantsToPlayCard handler for when local player taps
     *          card in hand
     * @param sSessionId the ID of the current browser session
     * @param bIsLocal if the player is local on this device
     */
    RoundWarGamePlay.prototype.makePlayerController = function(nPlayerNum, aPlayers, oPlayerRef, fnLocalPlayerWantsToPlayCard, sSessionId, bIsLocal) {

        var bIsSplitHalf = true;

        // gets or creates player's browser session Id
        sSessionId = sSessionId ? sSessionId : GameSession.getBrowserSessionId();

        aPlayers.push(new Player(nPlayerNum, oPlayerRef, this.cardWidth, sSessionId, bIsLocal));
        aPlayers[nPlayerNum].setOnTapCardInHand(fnLocalPlayerWantsToPlayCard.bind(this), bIsSplitHalf);

    };

    return RoundWarGamePlay;
});
