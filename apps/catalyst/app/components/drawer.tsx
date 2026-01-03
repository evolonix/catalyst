'use client';

import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { Heading } from './heading';
import { NavbarItem } from './navbar';
import { Text } from './text';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  full: 'sm:max-w-full',
};

export function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

export function Drawer({
  open,
  size = 'lg',
  preventCloseOnOutsideClick = false,
  children,
  onClose,
}: React.PropsWithChildren<{
  open: boolean;
  size?: keyof typeof sizes;
  preventCloseOnOutsideClick?: boolean;
  onClose: (value: boolean) => void;
}>) {
  const closeButtonRef = useRef<HTMLElement>(null);

  return (
    <Headless.Dialog
      open={open}
      onClose={
        preventCloseOnOutsideClick
          ? () => {
              // Close on outside click is prevented
            }
          : onClose
      }
    >
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 z-50 bg-black/70 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <Headless.DialogPanel
        transition
        className={clsx(
          sizes[size],
          'fixed inset-y-0 right-0 z-50 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:translate-x-full'
        )}
        style={
          {
            '--close-button-height': `${closeButtonRef.current?.offsetHeight ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <div
          className={clsx(
            'flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10'
          )}
        >
          <div className="-mb-3 self-end px-4 pt-3">
            <Headless.CloseButton
              ref={closeButtonRef}
              as={NavbarItem}
              aria-label="Close navigation"
              onClick={() => onClose(false)}
            >
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

export function DrawerHeader({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex shrink-0 flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  );
}

export function DrawerTitle({
  className,
  children,
  ...props
}: { children: React.ReactNode } & Omit<React.ComponentPropsWithoutRef<'h2'>, 'children'>) {
  return (
    <Heading level={2} {...props} className={clsx(className, 'text-zinc-950 dark:text-white')}>
      {children}
    </Heading>
  );
}

export function DrawerDescription({
  className,
  children,
  ...props
}: { children: React.ReactNode } & Omit<React.ComponentPropsWithoutRef<'p'>, 'children'>) {
  return (
    <Text {...props} className={clsx(className, 'mt-1 text-sm/6 text-zinc-600 dark:text-zinc-400')}>
      {children}
    </Text>
  );
}

export function DrawerBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'relative flex-1 overflow-y-auto px-4 py-6')}></div>;
}

export function DrawerActions({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex shrink-0 flex-col border-t border-zinc-950/5 p-4 dark:border-white/5',
        'items-center justify-start gap-3 *:w-full sm:flex-row-reverse sm:*:w-auto'
      )}
    />
  );
}

interface RoutedDrawerRenderProps {
  open: boolean;
  close: () => void;
}

export function RoutedDrawer({
  size = 'lg',
  children,
  onClosed,
}: {
  size?: keyof typeof sizes;
  children: React.ReactNode | ((api: RoutedDrawerRenderProps) => React.ReactNode);
  onClosed: () => void;
}) {
  const closeButtonRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), []);

  const renderProps: RoutedDrawerRenderProps = {
    open,
    close,
  };

  return (
    <AnimatePresence onExitComplete={onClosed}>
      {open ? (
        <Headless.Dialog
          open={open}
          onClose={() => {
            // Disable closing the drawer by clicking outside or pressing Escape
          }}
        >
          {/* Backdrop */}
          <Headless.DialogBackdrop>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // enter 300ms ease-out
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // exit 200ms ease-in
              }}
            />
          </Headless.DialogBackdrop>
          {/* Drawer panel */}
          <Headless.DialogPanel>
            <motion.div
              className={clsx(sizes[size], 'fixed inset-y-0 right-0 z-50 w-full max-w-80 p-2')}
              style={
                {
                  '--close-button-height': `${closeButtonRef.current?.offsetHeight ?? 0}px`,
                } as React.CSSProperties
              }
              initial={{ x: '100%' }}
              animate={{
                x: 0,
                transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // enter 300ms ease-out
              }}
              exit={{
                x: '100%',
                transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // exit 200ms ease-in
              }}
            >
              <div
                className={clsx(
                  'flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10'
                )}
              >
                <div className="-mb-3 self-end px-4 pt-3">
                  <Headless.CloseButton
                    ref={closeButtonRef}
                    as={NavbarItem}
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                  >
                    <CloseMenuIcon />
                  </Headless.CloseButton>
                </div>
                {typeof children === 'function' ? children(renderProps) : children}
              </div>
            </motion.div>
          </Headless.DialogPanel>
        </Headless.Dialog>
      ) : null}
    </AnimatePresence>
  );
}
