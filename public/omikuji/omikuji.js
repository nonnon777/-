document.getElementById("drawButton").addEventListener("click", drawFortune);

function drawFortune() {
    document.getElementById("drawButton").remove();
    // おみくじの結果とメッセージの設定
    const fortunes = [
        { result: "大吉", overallMessage: "最高の運勢！良いことがたくさんあるでしょう。", gradeProbability: "1%" },
        { result: "中吉", overallMessage: "運勢は良好です。新しい挑戦にも向いています。", gradeProbability: "5%" },
        { result: "小吉", overallMessage: "まずまずの運勢。大きな期待は控えめに。", gradeProbability: "10%" },
        { result: "吉", overallMessage: "運勢は安定しています。努力が大切です。", gradeProbability: "15%" },
        { result: "末吉", overallMessage: "少し運勢は下がり気味。焦らず進めましょう。", gradeProbability: "20%" },
        { result: "凶", overallMessage: "気を引き締めて。トラブルに注意。", gradeProbability: "50%" },
        { result: "大凶", overallMessage: "最悪の運勢。慎重に行動しましょう。", gradeProbability: "75%" }
    ];

    const categories = {
        health: ["絶好調", "良好", "普通", "要注意", "不調"],
        wealth: ["大金持ち", "良い買い物日和", "普通", "節約を心がけて", "金欠注意"],
        love: ["理想の相手が現れると思った？", "良い出会いあると思った？残念", "平和な日常", "注意が必要", "波乱の予感"],
    };

    // ランダムでおみくじと運勢を選択
    const selectedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const selectedHealth = categories.health[Math.floor(Math.random() * categories.health.length)];
    const selectedWealth = categories.wealth[Math.floor(Math.random() * categories.wealth.length)];
    const selectedLove = categories.love[Math.floor(Math.random() * categories.love.length)];
    if (Math.random() < 0.05) { // 0.05は5%の確率
        document.getElementById("fullScreenImage1").style.display = "block";
    } 
    if (Math.random() < 0.01) {
        document.getElementById("fullScreenImage2").style.display = "block";
    }
    // 結果を表示
    document.getElementById("fortune").textContent = selectedFortune.result;
    document.getElementById("overallMessage").textContent = selectedFortune.overallMessage;
    document.getElementById("gradeProbability").textContent = selectedFortune.gradeProbability;
    document.getElementById("health").textContent = selectedHealth;
    document.getElementById("wealth").textContent = selectedWealth;
    document.getElementById("love").textContent = selectedLove;

    document.getElementById("result").classList.remove("hidden");
}
