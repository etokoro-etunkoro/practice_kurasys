 let currentTargetSpan = null;

    function showNumberPicker(targetElement) {
      const picker = document.getElementById("number-picker");
      picker.innerHTML = ""; // 初期化

      for (let i = 0; i <= 20; i++) {
        const item = document.createElement("div");
        item.textContent = i;
        item.className = "picker-item";
        item.addEventListener("click", () => {
          if (currentTargetSpan) {
            currentTargetSpan.textContent = i;
            currentTargetSpan.classList.add("highlighted");
          }
          picker.style.display = "none";
        });
        picker.appendChild(item);
      }

      const rect = targetElement.getBoundingClientRect();
      picker.style.top = `${window.scrollY + rect.bottom}px`;
      picker.style.left = `${window.scrollX + rect.left}px`;
      picker.style.display = "block";
    }

    document.querySelectorAll(".editable-span").forEach(span => {
      span.addEventListener("click", () => {
        currentTargetSpan = span;
        showNumberPicker(span);
      });
    });

    // クリック外しでピッカー非表示
    document.addEventListener("click", e => {
      const picker = document.getElementById("number-picker");
      if (!picker.contains(e.target) && !e.target.classList.contains("editable-span")) {
        picker.style.display = "none";
      }
    });