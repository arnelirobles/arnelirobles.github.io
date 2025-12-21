---
layout: page
title: Blog
description: Local posts and Medium articles - tech musings, hugot, and projects from the Baryo
---

<style>
/* Override sidebar layout to prevent content from being hidden */
.VPDoc.has-sidebar .content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.VPDoc .container {
  max-width: 100% !important;
  margin: 0 auto;
}

.VPDoc .content-container {
  max-width: 100% !important;
}

.content-container .main {
  max-width: 100% !important;
  width: 100%;
}

.VPDoc.has-aside .content-container {
  max-width: 100% !important;
}

/* Ensure proper spacing from sidebar */
@media (min-width: 960px) {
  .VPDoc.has-sidebar .content {
    padding-left: var(--vp-sidebar-width) !important;
  }
}

@media (min-width: 1440px) {
  .VPDoc.has-sidebar .content {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width)) !important;
  }
}

.blog-header {
  padding: 0 3rem;
  margin-bottom: 2rem;
}

/* Ensure blog list has proper spacing */
.blog-list {
  width: 100%;
}
</style>

<div class="blog-header">

# Blog

Local markdown posts and Medium articles combined. Writing about tech, open source, and the occasional hugot from a developer in the Baryo.

</div>

<BlogList />
