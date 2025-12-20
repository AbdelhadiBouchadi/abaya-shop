import { SortFilterItem } from '@/lib/constants';
import { FilterItem } from './FilterItem';
import FilterItemDropDown from './Dropdown';

export type PathFilterItem = { title: string; path: string };
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <ul className="space-y-1">
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </ul>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <nav className="font-text">
      {title ? (
        <h3 className="hidden text-xs font-bold text-[#9d5035] uppercase tracking-widest md:block mb-4">
          {title}
        </h3>
      ) : null}

      {/* Desktop List */}
      <div className="hidden md:block">
        <FilterItemList list={list} />
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <FilterItemDropDown list={list} />
      </div>
    </nav>
  );
}
