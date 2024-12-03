import React from 'react'

const footer = () => {
  return (
    <div>
      <div className="bg-base-100 flex flex-col items-center justify-between gap-4">
        <div className="text-center text-base text-muted-foreground">
          © 2023 StreamX. All rights reserved.
        </div>
        <div className="flex justify-center gap-4">
          <a
            href='#'
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost text-sm"
          >
            About
          </a>
          <a
            href='#'
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost text-sm"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Footer */}
    <div className="dark:bg-base-900"></div>
    <footer className="border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href='#'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            StreamX
          </a>
          . The source code is available on{" "}
          <a
            href='#'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
    </div>
  )
}

export default footer