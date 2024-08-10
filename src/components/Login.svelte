<script lang="ts">
  import * as Etebase from "etebase";
  import { savedEtebaseSession } from "../stores";
  import { loadSession, pushErrorToast, pushToast } from "../nav";

  let loginInProgress = false;
  let username: string;
  let password: string;
  let endpoint: string;

  async function handleLogin() {
    console.info("Logging into Etebase..");
    pushToast("Logging into Etebase..", { "--toastBarHeight": "0px" });
    loginInProgress = true;
    try {
      const ebAccount = await Etebase.Account.login(
        username,
        password,
        endpoint
      );
      const savedSession = await ebAccount.save();
      savedEtebaseSession.set(savedSession);

      await loadSession(ebAccount);
    } catch (error) {
      pushErrorToast("Couldn't log in");
      loginInProgress = false;
      console.error(error);
    }
  }
</script>

<div id="login">
  <h1 style="margin: 0;">Log in</h1>
  <i>Use your Etebase credentials</i>
  <input
    style="width: 100%"
    placeholder="Etebase username"
    bind:value={username}
  />
  <input
    style="width: 100%"
    placeholder="Etebase password"
    type="password"
    bind:value={password}
  />
  <input
    style="width: 100%"
    placeholder="Etebase endpoint"
    bind:value={endpoint}
  />
  <button on:click={handleLogin} disabled={loginInProgress}>Log in</button>
  <div style="margin-bottom:5vh">
    <!-- this is to compensate for the empty space above the h1 -->
  </div>
</div>

<style>
  #login {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    max-width: 300px;
    height: 100vh;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
  }
</style>
