import { Link } from 'react-router-dom';

import styles from './ChatCompare.module.scss';

export interface ChatCompareColumn {
  id: string;
  name: string;
  image: string;
  path: string;
  price: string;
}

export interface ChatCompareRow {
  label: string;
  values: string[];
  isDifferent: boolean;
}

interface ChatCompareProps {
  caption: string;
  columns: ChatCompareColumn[];
  rows: ChatCompareRow[];
}

export const ChatCompare = ({ caption, columns, rows }: ChatCompareProps) => (
  <div className={styles.root}>
    <table className={styles.table}>
      <caption className={styles.caption}>{caption}</caption>
      <thead>
        <tr>
          <td className={styles.corner} />
          {columns.map((column) => (
            <th
              key={column.id}
              scope="col"
              className={styles.product}
            >
              <Link
                to={column.path}
                className={styles.link}
              >
                <img
                  className={styles.image}
                  src={column.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.name}>{column.name}</span>
                <span className={styles.price}>{column.price}</span>
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.label}
            className={[styles.row, row.isDifferent && styles.different]
              .filter(Boolean)
              .join(' ')}
          >
            <th
              scope="row"
              className={styles.rowLabel}
            >
              {row.label}
            </th>
            {columns.map((column, index) => (
              <td
                key={column.id}
                className={styles.cell}
              >
                {row.values[index]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
