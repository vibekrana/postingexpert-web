"use client";

export function AppTopbar() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      {/* Brand selector */}
      <div>
        <p className="text-xs text-muted-foreground">Current brand</p>
        <p className="text-sm font-medium">Crafting Brain</p>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Aman</p>
          <p className="text-xs text-muted-foreground">admin</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium">
          A
        </div>
      </div>
    </div>
  );
}
