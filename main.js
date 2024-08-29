// Função para ler o arquivo e extrair as linhas
function processFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.split(/\r?\n/).filter(Boolean); // Divide em linhas e remove linhas vazias
      resolve(lines);
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsText(file);
  });
}

// Função para mostrar o modal
function showModal(message) {
  const modal = document.getElementById("noFileModal");
  modal.querySelector("p").textContent = message;
  modal.style.display = "block";
}

// Função para enviar SMS
function sendSms(number, message) {
  // Limpa o conteúdo da seção antes de enviar novas mensagens
  const section = document.querySelector("section");
  section.innerHTML = ""; // Limpa a seção
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "App 1b803934463b8724d38062a5feeb90eb-9bd9e92d-2dba-43e7-90e7-9ea9d8b99a7f"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const raw = JSON.stringify({
    messages: [
      {
        destinations: [{ to: number }],
        from: "ServiceSMS",
        text: message,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://1v53gn.api.infobip.com/sms/2/text/advanced", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (
        result?.requestError?.serviceException?.messageId === "UNAUTHORIZED"
      ) {
        const section = document.querySelector("section");
        const newMessage = document.createElement("p");
        newMessage.textContent = `Erro para enviar ao número: ${number}`;
        newMessage.classList.add("error");
        section.appendChild(newMessage);
      } else {
        const section = document.querySelector("section");
        const newMessage = document.createElement("p");
        newMessage.textContent = `Exito para enviar ao número: ${number}`;
        newMessage.classList.add("success");
        section.appendChild(newMessage);
      }
    })
    .catch((error) => {
      const section = document.querySelector("section");
      const newMessage = document.createElement("p");
      newMessage.textContent = `Erro para enviar ao número: ${number}`;
      newMessage.classList.add("error");
      section.appendChild(newMessage);
    });
}

// Selecionar elementos
const textArea = document.getElementById("userInput");
const sendButton = document.getElementById("showFileContent");

// Função para verificar se o textarea está vazio
function checkTextArea() {
  if (textArea.value.trim() === "") {
    sendButton.disabled = true; // Desabilita o botão se o textarea estiver vazio
  } else {
    sendButton.disabled = false; // Habilita o botão se houver texto
  }
}

// Verificar o textarea ao carregar a página
checkTextArea();

// Adicionar evento de input ao textarea para monitorar mudanças
textArea.addEventListener("input", checkTextArea);

// Função para verificar a senha e processar o arquivo se a senha estiver correta
function checkPasswordAndProcess() {
  const passwordInput = document.getElementById("passwordInput");
  const passwordModal = document.getElementById("passwordModal");

  if (passwordInput.value === "skdjfhsdkhfsdkfhsdkfshdkj") {
    passwordModal.style.display = "none"; // Fecha o modal
    // Processar o arquivo e enviar SMS
    const input = document.getElementById("fileInput");
    const messageText = document.getElementById("userInput").value;

    if (input.files && input.files.length > 0) {
      processFile(input.files[0])
        .then((numbers) => {
          numbers.forEach((number) => {
            sendSms(number, messageText);
          });
        })
        .catch((error) => {
          console.error("Erro ao processar o arquivo:", error);
        });
    } else {
      showModal("Nenhum arquivo selecionado.");
    }
  } else {
    alert("Senha incorreta. Tente novamente.");
    passwordInput.value = ""; // Limpa o campo de senha
    passwordInput.focus(); // Foca no campo de senha
  }
}

// Mostrar o modal de senha ao clicar no botão "Enviar mensagens"
sendButton.addEventListener("click", function () {
  document.getElementById("passwordModal").style.display = "block";
});

// Verificar a senha quando o botão "Confirmar" for clicado
document
  .getElementById("confirmPasswordButton")
  .addEventListener("click", checkPasswordAndProcess);

// Permitir a entrada de senha por "Enter"
document
  .getElementById("passwordInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      checkPasswordAndProcess();
    }
  });

// Fechar o modal de arquivo não selecionado ao clicar no botão de fechar
document.querySelector(".close-button").addEventListener("click", function () {
  const modal = document.getElementById("noFileModal");
  modal.style.display = "none";
});

// Fechar o modal se o usuário clicar fora dele
window.addEventListener("click", function (event) {
  const modal = document.getElementById("noFileModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
