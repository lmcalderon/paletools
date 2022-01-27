export default function fixLeagueUpdates() {
    const UTSBCSetEntity_isComplete = UTSBCSetEntity.prototype.isComplete;
    UTSBCSetEntity.prototype.isComplete = function () {
        if(this.repeatabilityMode ==="UNLIMITED") return false;

        return UTSBCSetEntity_isComplete.call(this);
    }
}