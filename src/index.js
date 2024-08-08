import * as VKID from "@vkid/sdk";

async function component() {
  const element = document.createElement("div");
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  document.body.appendChild(element);
  let searchParams = new URL(document.location.toString()).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const deviceId = searchParams.get("device_id");
  if (code && state && deviceId) {
    console.log("code", code);
    console.log("state", state);
    console.log(" deviceId", deviceId);
    const resp = await fetch("https://atwrk.ru/api/vkAuth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        code: code,
        state: state,
        deviceId: deviceId,
      }),
    });
    console.log("resp", resp);
    searchParams.delete("code");
    searchParams.delete("state");
    searchParams.delete("device_id");
  } else {
    const res = await fetch("https://atwrk.ru/api/vkAuth/pkce");
    const data = await res.json();
    console.log("data", data);
    VKID.Config.init({
      app: 52056077, // Идентификатор приложения. Указан в самом приложении
      redirectUrl: "http://localhost", // Адрес для перехода после авторизации. Должен быть в доверенных доменах приложенмия
      state: data.data.state, // Произвольная строка состояния приложения. Приходит с бека
      code_challenge: data.data.codeChallenge, // Приходит с бека
      code_challenge_method: "s256", // Верификатор в виде случайной строки. Обеспечивает защиту передаваемых данных. s256 - стандартное
      scope: "email phone", // Список прав доступа, которые нужны приложению.
      mode: VKID.ConfigAuthMode.InNewTab,
    });

    console.log(data.data);

    // Создание экземпляра кнопки.
    const oneTap = new VKID.OneTap();

    // Получение контейнера из разметки.
    const container = document.getElementById("VkIdSdkOneTap");

    // Проверка наличия кнопки в разметке.
    if (container) {
      // Отрисовка кнопки в контейнере с именем приложения APP_NAME, светлой темой и на русском языке.
      oneTap
        .render({
          container: container,
          scheme: VKID.Scheme.LIGHT,
          lang: VKID.Languages.RUS,
        })
        .on(VKID.WidgetEvents.ERROR, console.log); // handleError — какой-либо обработчик ошибки.
    }
  }
}

component();
