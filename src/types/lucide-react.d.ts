// src/types/lucide-react.d.ts
import { ComponentType, SVGProps, RefAttributes } from 'react';

declare module 'lucide-react' {
    // Define the props that Lucide icons accept
    export interface LucideProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        color?: string;
        strokeWidth?: string | number;
    }

    // Define the LucideIcon type
    export type LucideIcon = ComponentType<LucideProps>;

    // Export all the icon components
    export const Calculator: LucideIcon;
    export const DollarSign: LucideIcon;
    export const PieChart: LucideIcon;
    export const Users: LucideIcon;
    // Add any other icons you use here
}