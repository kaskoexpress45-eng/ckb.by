import Link from "next/link";
import {articles} from "@/content/articles";
import {Arrow,ConsultationCTA} from "@/components/ui";
export const metadata={title:"Материалы о продажах и переговорах",description:"Практические заметки о подготовке к переговорам и развитии навыков продаж.",alternates:{canonical:"/stati"}};
export default function Articles(){return <><section className="section"><div className="container"><span className="eyebrow">Практические заметки</span><h1>Понять. Подготовиться.<br/>Применить.</h1><div className="other-directions section-link">{articles.map(a=><Link className="direction-row" href={`/stati/${a.slug}`} key={a.slug}><div><h2>{a.title}</h2><p>{a.description}</p></div><span className="round-arrow"><Arrow diagonal/></span></Link>)}</div><a className="text-link" href={process.env.NEXT_PUBLIC_LEGACY_ARCHIVE_URL||"https://ckb.by/articles/"}>Архив публикаций на действующем CKB.by <Arrow diagonal/></a></div></section><ConsultationCTA/></>;}
