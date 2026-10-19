import type { FC, SVGProps } from 'react';
import ApertureSvg from '../../../public/icons/icon-aperture.svg';
import ArrowLeftSvg from '../../../public/icons/icon-arrow-left.svg';
import CalendarDaysSvg from '../../../public/icons/icon-calendar-days.svg';
import CameraSvg from '../../../public/icons/icon-camera.svg';
import MapPinSvg from '../../../public/icons/icon-map-pin.svg';

// Next.js types every `*.svg` import as `any`; SVGR makes each one a component.
export type Icon = FC<SVGProps<SVGSVGElement>>;

export const ApertureIcon: Icon = ApertureSvg;
export const ArrowLeftIcon: Icon = ArrowLeftSvg;
export const CalendarDaysIcon: Icon = CalendarDaysSvg;
export const CameraIcon: Icon = CameraSvg;
export const MapPinIcon: Icon = MapPinSvg;
