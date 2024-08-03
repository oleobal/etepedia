<script lang="ts">
  import * as Etebase from "etebase";
  import { etebaseAccount, savedEtebaseSession } from "../stores";
  import { push } from "svelte-spa-router";

  function handleLogout() {
    etebaseAccount.set(null);
    savedEtebaseSession.reset();
    push("/");
  }
</script>

<button on:click={handleLogout}>Log out</button>
