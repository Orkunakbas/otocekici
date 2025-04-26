"use client";

import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Divider,
  VisuallyHidden,
  useRadio,
  RadioGroup,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardCharts } from '@/store/slices/dashboardChartsSlice';

const AksiyonDurumTablosu = () => {
  const t = useTranslations('app.denetim');
  const dispatch = useDispatch();
  
  // Çevirilerden risk kategorilerini al
  const riskCategoriesFromTranslations = [
    t('stats.charts.riskCategories.completed'),
    t('stats.charts.riskCategories.lowRisk'),
    t('stats.charts.riskCategories.mediumRisk'),
    t('stats.charts.riskCategories.highRisk')
  ];
  
  // Statik veri (geçici çözüm)
  const staticData = {
    title: t('stats.charts.aksiyonDurumTablosu'),
    value: "134",
    categories: riskCategoriesFromTranslations,
    color: "success",
    chartData: [
      { kategori: "İnsan Kaynakları", [riskCategoriesFromTranslations[0]]: 12, [riskCategoriesFromTranslations[1]]: 4, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Pazarlama", [riskCategoriesFromTranslations[0]]: 1, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Sağlık Sigortaları", [riskCategoriesFromTranslations[0]]: 7, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Özel Teknik", [riskCategoriesFromTranslations[0]]: 1, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Satış", [riskCategoriesFromTranslations[0]]: 1, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Kurumsal İletişim", [riskCategoriesFromTranslations[0]]: 9, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 2, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Oto Dışı Teknik", [riskCategoriesFromTranslations[0]]: 5, [riskCategoriesFromTranslations[1]]: 2, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Hukuk Baş. Hasar", [riskCategoriesFromTranslations[0]]: 3, [riskCategoriesFromTranslations[1]]: 3, [riskCategoriesFromTranslations[2]]: 1, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Oto Dışı Hasar", [riskCategoriesFromTranslations[0]]: 1, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Nakliyat", [riskCategoriesFromTranslations[0]]: 5, [riskCategoriesFromTranslations[1]]: 5, [riskCategoriesFromTranslations[2]]: 3, [riskCategoriesFromTranslations[3]]: 2 },
      { kategori: "Muhasebe", [riskCategoriesFromTranslations[0]]: 0, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 2, [riskCategoriesFromTranslations[3]]: 0 },
      { kategori: "Bilgi Güvenliği", [riskCategoriesFromTranslations[0]]: 0, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 2, [riskCategoriesFromTranslations[3]]: 7 },
      { kategori: "Sağ. İdari İşler", [riskCategoriesFromTranslations[0]]: 1, [riskCategoriesFromTranslations[1]]: 0, [riskCategoriesFromTranslations[2]]: 0, [riskCategoriesFromTranslations[3]]: 0 }
    ]
  };
  
  // Redux store'dan verileri al
  const dashboardCharts = useSelector((state) => state.dashboardCharts);
  const { data: userInfo } = useSelector((state) => state.userInfo);
  
  // Verileri çıkart
  const chartData = dashboardCharts?.chartData || [];
  const totalAksiyonlar = dashboardCharts?.totalAksiyonlar || 0;
  const riskCategories = dashboardCharts?.riskCategories || riskCategoriesFromTranslations;
  const loading = dashboardCharts?.loading;
  const error = dashboardCharts?.error || null;
  const userRole = dashboardCharts?.userRole || userInfo?.role;
  
  // Debug için
  useEffect(() => {
    console.log("Dashboard Charts State:", dashboardCharts);
  }, [dashboardCharts]);
  
  // Sadece danışman ve yönetici rolleri için göster
  if (userRole === 'temsilci') {
    return null;
  }
  
  // Redux verisi yoksa statik veriyi kullan
  if (!dashboardCharts || !chartData || chartData.length === 0) {
    console.log("Statik veri kullanılıyor");
    return (
      <dl className="w-full px-4">
        <BarChartCard {...staticData} />
      </dl>
    );
  }
  
  // Grafik verisi
  const data = [
    {
      title: t('stats.charts.aksiyonDurumTablosu'),
      value: totalAksiyonlar.toString(),
      categories: riskCategories,
      color: "success",
      chartData: chartData
    }
  ];
  
  return (
    <dl className="w-full px-4">
      {data.map((item, index) => (
        <BarChartCard key={index} {...item} />
      ))}
    </dl>
  );
};

const BarChartCard = React.forwardRef(
  ({className, title, value, categories, color, chartData, ...props}, ref) => {
    const t = useTranslations('app.denetim');
    
    // Kategori adlarını kısaltma fonksiyonu
    const shortenCategory = (category) => {
      const words = category.split(' ');
      
      // Tüm kısaltmalar büyük harf olacak
      if (words.length === 1) {
        // Tek kelime ise ilk 3 harfini al
        return words[0].substring(0, 3).toUpperCase();
      }
      
      // Çok kelimeli ise baş harfleri al
      return words.map(word => word.charAt(0).toUpperCase()).join('');
    };

    // Orijinal veriyi kısaltılmış etiketlerle güncelle
    const chartDataWithShortLabels = chartData.map(item => {
      const shortLabel = shortenCategory(item.kategori);
      return { ...item, shortLabel, originalLabel: item.kategori };
    });

    // Özel renkler - orijinal renkleri koru
    const customColors = {
      "Yüksek Risk": "#1e203e",     // Koyu gri
      "Orta Risk": "#515692",       // Orta gri
      "Düşük Risk": "#8e95e7",      // Açık gri
      "Tamamlanmış": "#c9cbed"      // Çok koyu gri
    };

    return (
      <Card
        ref={ref}
        className={cn(" border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm", className)}
        {...props}
      >
        <div className="flex flex-col gap-y-2 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <dt>
              <h3 className="text-medium font-semibold text-default-700">{title}</h3>
            </dt>
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: customColors[category] || `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                    }}
                  />
                  <span className="text-tiny text-default-600">{category}</span>
                </div>
              ))}
            </div>
          </div>
          <dd className="flex items-baseline gap-x-1">
            <span className="text-sm font-medium text-default-500">{t('stats.charts.totalActions')}: </span>
            <span className="text-sm font-semibold text-default-900">{value}</span>
          </dd>
        </div>

        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          width="100%"
          height={400}
        >
          <BarChart
            accessibilityLayer
            data={chartDataWithShortLabels}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 50,
            }}
          >
            <XAxis
              dataKey="shortLabel"
              style={{fontSize: "var(--heroui-font-size-tiny)"}}
              tickLine={false}
              angle={0}
              textAnchor="middle"
              interval={0}
              height={50}
              tickMargin={10}
              tick={{fill: 'var(--heroui-default-500)'}}
            />

            <YAxis
              axisLine={false}
              style={{fontSize: "var(--heroui-font-size-tiny)"}}
              tickLine={false}
              tick={{fill: 'var(--heroui-default-500)'}}
              tickCount={6}
              domain={[0, 'dataMax + 2']}
            />

            <Tooltip
              content={({label, payload}) => {
                // Orijinal kategori adını bul
                const originalCategory = chartDataWithShortLabels.find(item => item.shortLabel === label)?.originalLabel || label;
                
                return (
                  <div className="flex h-auto min-w-[120px] items-center gap-x-2 rounded-medium bg-background p-2 text-tiny shadow-small">
                    <div className="flex w-full flex-col gap-y-1">
                      <span className="font-medium text-foreground">{originalCategory}</span>
                      {payload?.map((p, index) => {
                        const name = p.name;
                        const value = p.value;
                        const category = categories.find((c) => c === name) ?? name;

                        return (
                          <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                            <div
                              className="h-2 w-2 flex-none rounded-full"
                              style={{
                                backgroundColor: customColors[category] || `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                              }}
                            />

                            <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                              <span className="text-default-500">{category}</span>
                              <span className="font-mono font-medium text-default-700">{value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
              cursor={false}
            />

            {categories.map((category, index) => (
              <Bar
                key={`${category}-${index}`}
                animationDuration={450}
                animationEasing="ease"
                barSize={48}
                dataKey={category}
                fill={customColors[category] || `hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
                radius={index === categories.length - 1 ? [4, 4, 0, 0] : 0}
                stackId="bars"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  },
);

BarChartCard.displayName = "BarChartCard";

const ButtonRadioItem = React.forwardRef(
  ({children, color, size = "sm", variant, ...props}, ref) => {
    const {Component, isSelected, getBaseProps, getInputProps} = useRadio(props);

    return (
      <Component {...getBaseProps()} ref={ref}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <Button
          disableRipple
          className={cn("pointer-events-none text-default-500", {
            "text-foreground": isSelected,
          })}
          color={color}
          size={size}
          variant={variant || isSelected ? "solid" : "flat"}
        >
          {children}
        </Button>
      </Component>
    );
  },
);

ButtonRadioItem.displayName = "ButtonRadioItem";

export default AksiyonDurumTablosu;