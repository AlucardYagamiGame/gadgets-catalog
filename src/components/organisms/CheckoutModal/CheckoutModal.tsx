import { Button } from '@/components/atoms/Button';
import { CityAutocomplete } from '@/components/molecules/CityAutocomplete';
import { Dropdown } from '@/components/molecules/Dropdown';
import { FormField } from '@/components/molecules/FormField';
import { Modal } from '@/components/molecules/Modal';
import { PhoneField } from '@/components/molecules/PhoneField';
import { CHECKOUT_FIELDS } from '@/constants';
import {
  useCheckoutForm,
  useNovaPoshtaCities,
  useNovaPoshtaWarehouses,
  useTranslation,
} from '@/hooks';

import styles from './CheckoutModal.module.scss';

import type { CheckoutFormValues, NovaPoshtaPointKind } from '@/types';

interface CheckoutModalProps {
  total: number;
  count: number;
  onSubmit: (values: CheckoutFormValues) => void;
  onClose: () => void;
}

export const CheckoutModal = ({
  total,
  count,
  onSubmit,
  onClose,
}: CheckoutModalProps) => {
  const { t, formatPrice } = useTranslation();
  const c = t.checkout;
  const {
    values,
    errors,
    isSubmitted,
    handleChange,
    handlePhoneChange,
    handleCityChange,
    handleSelect,
    handleSubmit,
  } = useCheckoutForm(onSubmit);

  const pointKind: NovaPoshtaPointKind | null =
    values.delivery === 'courier' ? null : values.delivery;

  const cities = useNovaPoshtaCities(values.cityRef ? '' : values.city);
  const warehouses = useNovaPoshtaWarehouses(values.cityRef, pointKind);

  const cityOptions = cities.cities.map((city) => ({
    value: city.Ref,
    label:
      city.AreaDescription ?
        `${city.Description}, ${city.AreaDescription}`
      : city.Description,
  }));

  const pointOptions = warehouses.points.map((point) => ({
    value: point.Ref,
    label: point.Description,
  }));

  const cityMessage =
    cities.isLoading ? c.novaPoshta.searching
    : cities.error ? cities.error
    : cities.isSearchable ? c.novaPoshta.noCities
    : undefined;

  const getPointPlaceholder = (idle: string) =>
    !values.cityRef ? c.novaPoshta.selectCity
    : warehouses.isLoading ? c.novaPoshta.loading
    : warehouses.error ? warehouses.error
    : pointOptions.length === 0 ? c.novaPoshta.noPoints
    : idle;

  const getError = (name: keyof CheckoutFormValues) => {
    const code = errors[name];
    return code ? c.validation[code] : undefined;
  };

  const handleCitySelect = (ref: string) => {
    const city = cities.cities.find((item) => item.Ref === ref);

    if (city) {
      handleCityChange(city.Description, city.Ref);
    }
  };

  if (isSubmitted) {
    return (
      <Modal
        title={c.orderPlaced}
        closeLabel={t.common.close}
        onClose={onClose}
      >
        <div className={styles.success}>
          <p className={styles.successText}>{c.thanks(values.name.trim())}</p>
          <Button
            className={styles.submit}
            onClick={onClose}
          >
            {t.common.close}
          </Button>
        </div>
      </Modal>
    );
  }

  const renderDeliveryOption = (value: string) => {
    const isChecked = values.delivery === value;

    return (
      <div
        key={value}
        className={`${styles.option} ${isChecked ? styles.optionActive : ''}`}
      >
        <label className={styles.optionHeader}>
          <input
            className={styles.radio}
            type="radio"
            name="delivery"
            value={value}
            checked={isChecked}
            onChange={handleChange}
          />
          {c.delivery[value as keyof typeof c.delivery]}
        </label>

        {isChecked && (
          <div className={styles.optionBody}>
            {value === 'branch' && (
              <Dropdown
                fullWidth
                multiline
                autoPlacement
                name="branch"
                disabled={!values.cityRef || warehouses.isLoading}
                placeholder={getPointPlaceholder(c.novaPoshta.selectBranch)}
                options={pointOptions}
                value={values.branch}
                error={getError('branch')}
                onChange={(val: string) => handleSelect('branch', val)}
              />
            )}

            {value === 'postomat' && (
              <Dropdown
                fullWidth
                multiline
                autoPlacement
                name="postomat"
                disabled={!values.cityRef || warehouses.isLoading}
                placeholder={getPointPlaceholder(c.novaPoshta.selectPostomat)}
                options={pointOptions}
                value={values.postomat}
                error={getError('postomat')}
                onChange={(val: string) => handleSelect('postomat', val)}
              />
            )}

            {value === 'courier' && (
              <FormField
                name="address"
                label={c.fields.address}
                type="text"
                autoComplete="street-address"
                value={values.address}
                error={getError('address')}
                onChange={handleChange}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      wide
      title={c.title}
      closeLabel={t.common.close}
      onClose={onClose}
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className={styles.leftCol}>
          <div className={styles.fields}>
            {CHECKOUT_FIELDS.map((field) =>
              field.name === 'city' ?
                <CityAutocomplete
                  key={field.name}
                  name={field.name}
                  label={c.fields[field.name]}
                  autoComplete="off"
                  value={values.city}
                  options={cityOptions}
                  message={cityMessage}
                  error={getError('city')}
                  onInputChange={(city) => handleCityChange(city)}
                  onSelect={({ value }) => handleCitySelect(value)}
                />
              : field.name === 'phone' ?
                <PhoneField
                  key={field.name}
                  label={c.fields.phone}
                  value={values.phone}
                  error={getError('phone')}
                  onChange={handlePhoneChange}
                />
              : <FormField
                  key={field.name}
                  {...field}
                  label={c.fields[field.name as keyof typeof c.fields]}
                  value={values[field.name as keyof CheckoutFormValues]}
                  error={getError(field.name as keyof CheckoutFormValues)}
                  onChange={handleChange}
                />,
            )}
          </div>

          <div className={styles.deliveryGroup}>
            <div className={styles.legend}>{c.delivery.legend}</div>
            <div className={styles.options}>
              {renderDeliveryOption('branch')}
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.rightTop}>
            {renderDeliveryOption('postomat')}
            {renderDeliveryOption('courier')}
          </div>

          <div className={styles.rightBottom}>
            <section className={styles.summary}>
              <p className={styles.total}>{formatPrice(total)}</p>
              <p className={styles.count}>{t.cart.total(count)}</p>
            </section>

            <Button
              className={styles.submit}
              type="submit"
            >
              {c.placeOrder}
            </Button>

            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
