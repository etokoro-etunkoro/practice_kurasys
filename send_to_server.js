function sendToServer(data) {
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(json => {
      console.log("サーバー応答:", json);

      // ① 勝者が未入力で競合がある → 勝者入力フェーズ
      if (json.conflicts && json.conflicts.length > 0 && Object.keys(data.winners).length === 0) {
        const winnersMap = handleConflicts(json.conflicts);
        // 勝者を追加して再送信
        sendToServer({ round_data: data.round_data, winners: winnersMap });
        return;  // 勝者入力が終わるまで他の処理はしない
      }

      // ② 敗者がいる → 再入力フェーズ
      if (json.losers && Object.keys(json.losers).length > 0) {
        alert("じゃんけん敗者による再入力フェーズです。該当ブロックが再度入力してください。");
        console.log("再入力対象:", json.losers);
        renderTableFromGetDict(json.get_dict);
        enableReentry(json.losers);
        
        return;  // 再入力待ちなのでこれ以上処理しない
      }

      // ③ 全て確定 → 表と結果を更新
      showResults(json);
      renderTableFromGetDict(json.get_dict);
    })
    .catch(err => {
      console.error("送信エラー:", err);
      alert("サーバーとの通信に失敗しました。もう一度お試しください。");
    });
}
