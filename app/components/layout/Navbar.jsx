'use client';

import { useState, Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  CalendarIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link as ScrollLink } from 'react-scroll';

const productsData = [
  { name: 'Schedule an Interview', description: 'Schedule an official screening for a candidate', href: '/hr/schedule', icon: CalendarIcon },
  { name: 'AI Interview Practice', description: 'Practice your interviewing skills with our AI', href: '/interview/practice', icon: VideoCameraIcon },
  { name: 'Top Interview Questions', description: 'Review key questions for your role', href: '/interview-questions', icon: ChatBubbleLeftRightIcon },
  { name: 'Resume Screening', description: 'Get the Score of your resume', href: '/resume-screening', icon: PencilSquareIcon },
];

const callsToAction = [
  { name: 'Quizzes', href: '/tests', icon: QuestionMarkCircleIcon },
  { name: 'Join Us', href: '/contact', icon: UserPlusIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all font-sans">
      <nav aria-label="Global" className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
            <span className="sr-only">Quantix AI</span>
            <div className="relative p-1 rounded-xl bg-white/90 border border-slate-200/70 shadow-sm group-hover:border-sky-300 transition-colors">
              <img alt="Logo" src="/logo.jpg" className="h-8 w-auto rounded-lg" />
            </div>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-white/80 border border-transparent hover:border-slate-200/60 transition-all"
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="size-6" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-10 items-center">
          <Popover className="relative">
            {({ open }) => (
              <>
                <PopoverButton className="flex items-center gap-x-1.5 text-sm font-medium leading-6 text-slate-700 hover:text-sky-600 focus:outline-none transition-colors">
                  Product
                  <ChevronDownIcon className={`size-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-sky-500' : ''}`} />
                </PopoverButton>

                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-2 scale-95"
                  enterTo="opacity-100 translate-y-0 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0 scale-100"
                  leaveTo="opacity-0 translate-y-2 scale-95"
                >
                  <PopoverPanel className="absolute -left-12 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(2,132,199,0.08),0_1px_3px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/50">
                    <div className="p-3">
                      {productsData.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group relative flex items-center gap-x-4 rounded-2xl p-3.5 text-sm leading-6 hover:bg-[#FAF8F5]/90 transition-all"
                        >
                          <div className="flex size-11 flex-none items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-[inset_0_2px_4px_rgba(2,132,199,0.05)] group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all">
                            <item.icon className="size-5 transition-colors" aria-hidden="true" />
                          </div>
                          <div className="flex-auto">
                            <span className="block font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                              {item.name}
                            </span>
                            <p className="mt-0.5 text-xs text-slate-500 leading-snug">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-slate-100 bg-[#FAF8F5]/60 border-t border-slate-100">
                      {callsToAction.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-center gap-x-2 py-3 px-4 text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-white/80 transition-all"
                        >
                          <item.icon className="size-4 text-slate-400" aria-hidden="true" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>

          {['About', 'FAQ'].map((label) => (
            <ScrollLink
              key={label}
              to={label.toLowerCase()}
              smooth={true}
              offset={-80}
              duration={500}
              className="text-sm font-medium leading-6 text-slate-700 hover:text-sky-600 cursor-pointer transition-colors"
            >
              {label}
            </ScrollLink>
          ))}
        </PopoverGroup>

        {/* User Auth Section */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4 items-center">
          {session ? (
            <div className="flex items-center gap-x-3 bg-white/70 backdrop-blur-md border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                {session.user.user_metadata.full_name || session.user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors pl-2 border-l border-slate-200"
              >
                Log out <ArrowLeftOnRectangleIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="text-xs font-semibold py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-[0_4px_14px_rgba(2,132,199,0.3)] transition-all flex items-center gap-1 hover:shadow-[0_6px_20px_rgba(2,132,199,0.4)]"
            >
              Sign In <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>

      {/* Mobile Drawer (Glassmorphic) */}
      <Transition appear show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" />
          </Transition.Child>
          
          <div className="fixed inset-0 z-50 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="w-full max-w-sm bg-[#FAF8F5]/95 backdrop-blur-2xl p-6 shadow-2xl border-l border-white/80">
                <div className="flex items-center justify-between">
                  <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Quantix AI</span>
                    <img className="h-8 w-auto rounded-lg" src="/logo.jpg" alt="Logo" />
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-xl p-2.5 text-slate-600 hover:bg-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-slate-200/80">
                    <div className="space-y-2 py-6">
                      <Disclosure as="div" className="-mx-3">
                        {({ open }) => (
                          <>
                            <DisclosureButton className="flex w-full items-center justify-between rounded-xl py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-slate-800 hover:bg-white/80">
                              Product
                              <ChevronDownIcon className={`h-5 w-5 flex-none transition-transform ${open ? 'rotate-180 text-sky-500' : ''}`} aria-hidden="true" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 space-y-1">
                              {[...productsData, ...callsToAction].map((item) => (
                                <a
                                  key={item.name}
                                  href={item.href}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-medium text-slate-600 hover:bg-white hover:text-sky-600"
                                >
                                  {item.name}
                                </a>
                              ))}
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                      <a href="#" className="-mx-3 block rounded-xl px-3 py-2 text-base font-semibold text-slate-800 hover:bg-white/80">About</a>
                      <a href="#" className="-mx-3 block rounded-xl px-3 py-2 text-base font-semibold text-slate-800 hover:bg-white/80">FAQ</a>
                    </div>

                    <div className="py-6">
                      {session ? (
                        <button
                          onClick={handleLogout}
                          className="-mx-3 block w-full text-left rounded-xl px-3 py-2.5 text-base font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Log out
                        </button>
                      ) : (
                        <a
                          href="/auth/login"
                          className="-mx-3 block rounded-xl px-3 py-2.5 text-center text-base font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md"
                        >
                          Log in
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}