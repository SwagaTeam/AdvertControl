"use client";

import * as React from "react";

import { cn } from "./utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
      <div
          data-slot="table-container"
          className="relative w-full overflow-x-auto"
      >
        <table
            data-slot="table"
            className={cn(
                "w-full caption-bottom text-sm border-separate border-spacing-0",
                // Добавляем важные классы для трансформации
                "max-md:block max-md:border-0 max-md:shadow-sm",
                className
            )}
            {...props}
        />
      </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
      <thead
          className={cn(
              "[&_tr]:border-b",
              "max-md:hidden",           // ← главное изменение
              className
          )}
          {...props}
      />
  );
}


function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
      <tbody
          className={cn(
              "max-md:block max-md:space-y-4",   // расстояние между карточками
              className
          )}
          {...props}
      />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
      <tfoot
          data-slot="table-footer"
          className={cn(
              "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
              className,
          )}
          {...props}
      />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
      <tr
          className={cn(
              "border-b last:border-b-0 hover:bg-muted/50 transition-colors",
              "max-md:block max-md:rounded-lg max-md:border max-md:bg-card max-md:shadow-sm max-md:mb-4 max-md:overflow-hidden",
              className
          )}
          {...props}
      />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
      <td
          data-slot="table-cell"
          className={cn(
              "p-3 align-middle", // обычный десктопный стиль
              // Мобильная версия — превращаем в строку "Название: значение"
              "max-md:block max-md:w-full max-md:border-b max-md:last:border-b-0",
              "max-md:before:content-[attr(data-label)]",
              "max-md:before:font-medium max-md:before:text-muted-foreground",
              "max-md:before:inline-block max-md:before:w-1/2 max-md:before:pr-3",
              "max-md:pl-0 max-md:whitespace-normal",
              className
          )}
          {...props}
      />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
      <th
          data-slot="table-head"
          className={cn(
              "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
              className
          )}
          {...props}
      />
  );
}

function TableCaption({
                        className,
                        ...props
                      }: React.ComponentProps<"caption">) {
  return (
      <caption
          data-slot="table-caption"
          className={cn("text-muted-foreground mt-4 text-sm", className)}
          {...props}
      />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
