<script lang="ts">
  import * as Etebase from "etebase";
  import { savedEtebaseSession } from "../stores";
  import { loadSession } from "../nav";

  let loginInProgress = false;
  let username: string;
  let password: string;
  let endpoint: string;

  async function handleLogin() {
    console.info("Logging into Etebase..");
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
      loginInProgress = false;
      console.error(error);
    }
  }
</script>

<div
  id="login_form"
  style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      max-width: 300px;
      margin-right: auto;
      margin-left: auto;
      "
>
  <h1 style="margin-bottom: 0;">Log in</h1>
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
</div>
