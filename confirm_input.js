function confirmSpans() {
  rebuildConfirmedMembers();  // ← 最新の確定番号をセットに再構築 
  const errors = [];
  const draftData = {};
  const tempValues = [];

  const confirmedMembersLocal = new Set();  // 今回入力分の重複も防ぐ

  document.querySelectorAll("tbody tr").forEach(row => {
    const block = row.querySelector("th").textContent;
    const values = [];
    const spans = row.querySelectorAll("td span");

    spans.forEach(span => {
      const val = span.textContent.trim();
      if (val === "") return;

      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0 || num > 99) {
        errors.push(`不正な番号: ${val}（0〜99）`);
        return;
      }

      if (confirmedMembers.has(num) || confirmedMembersLocal.has(num)) {
        errors.push(`No.${num} はすでに確定済みです`);
        return;
      }

      if (!(num in validMembers)) {
        errors.push(`No.${num} は登録された新入寮生ではありません`);
        return;
      }

      values.push(num);
      confirmedMembersLocal.add(num);  // 一時的に記録
    });

    draftData[block] = values;
  });

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  // 巡目更新
  const roundSpan = document.getElementById("round");
  roundSpan.textContent = parseInt(roundSpan.textContent, 10) + 1;

  assignColors();
  sendToServer({ round_data: draftData, winners: {} });
}

let confirmedMembers = new Set();  // ← グローバルに定義

function rebuildConfirmedMembers() {
  confirmedMembers.clear();
  document.querySelectorAll("td span").forEach(span => {
    const val = span.textContent.trim();
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      confirmedMembers.add(num);
    }
  });
}
