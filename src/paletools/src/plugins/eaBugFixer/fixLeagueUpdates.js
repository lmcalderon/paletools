export default function fixLeagueUpdates() {
    const leagueAssetIds = [
        "1000291-96f4b0f4-3702", //premier league
        "1000292-e076e521-368e", // bundesliga
        "1000293-b469975b-66ee", // serie a
        "1000294-471f2f23-83ab", // la liga
        "1000295-5e37787c-4bae", // ligue 1
        
        "1000296-f5ba7e87-1a52", // premium premier league
        "1000297-9d01fd90-f66b", // premium bundesliga
        "1000298-4ffa1bd3-fc89", // premium la liga
        "1000300-112bca13-da06", // premium serie a
        "1000299-ccdd5dbc-c8a0" // premium ligue 1
    ];
    const UTSBCSetEntity_isComplete = UTSBCSetEntity.prototype.isComplete;
    UTSBCSetEntity.prototype.isComplete = function () {
        if (leagueAssetIds.indexOf(this.assetId) > -1) return false;
        return UTSBCSetEntity_isComplete.call(this);
    }
}