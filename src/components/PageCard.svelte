<script lang="ts">
  import { Page } from "../lib/eb";

  export let page: Page;
</script>

<a href={`#/page/${page.item.uid}`}>
  <div class="page-card">
    <h3>
      {page.meta.name}
    </h3>
    <p><em>{page.meta.description}</em></p>
  </div>
</a>

<style>
  h3,
  p {
    margin: 0;
  }
  a {
    color: var(--fg);
  }

  .page-card {
    border: 1px solid;
    text-align: left;
    padding: 10px;
    margin-bottom: 5px;
  }

  .page-card:hover {
    border-color: var(--primary);
  }
</style>
