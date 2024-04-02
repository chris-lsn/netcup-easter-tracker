import fs from 'fs'
import got from 'got'
import { Telegraf } from 'telegraf';
import he from 'he'

const bot = new Telegraf(process.env.TG_BOT_TOKEN)

const refs = [
  "/",
  "/ausbildung",
  "/bestellen/agb.php",
  "/bestellen/domainangebote.php",
  "/bestellen/produkt.php", 
  "/bestellen/softwareangebote.php",
  "/bestellen/warenkorb.php",
  "/groupware",
  "/hosting",
  "/hosting/qualitaetsgarantien.php",
  "/hosting/reseller-webhosting.php",
  "/hosting/webhosting-application-hosting.php",
  "/hosting/webhosting-testaccount.php",
  "/jobs",
  "/jobs/agile-projekt-manager-m-w-d",
  "/jobs/angular-developer-m-w-d",
  "/jobs/bachelor-of-engineering-studiengang-informationstechnik-m-w-d",
  "/jobs/big-data-engineer-cloud-services-m-w-d",
  "/jobs/cloud-native-engineer-m-w-d",
  "/jobs/cloud-platform-engineer-m-w-d",
  "/jobs/cloud-service-specialist-m-w-d",
  "/jobs/data-center-engineer-team-lead-m-w-d",
  "/jobs/frontend-developer-m-w-d",
  "/jobs/fullstack-developer-m-w-d",
  "/jobs/it-projektmanager-mit-schwerpunkt-cloud-services-m-w-d",
  "/jobs/junior-controller-m-w-d",
  "/jobs/junior-linux-system-engineer-m-w-d",
  "/jobs/junior-network-operation-engineer-im-noc-m-w-d",
  "/jobs/linux-system-engineer-m-w-d",
  "/jobs/marketing-manager-m-w-d",
  "/jobs/microsoft-system-engineer-m-w-d",
  "/jobs/mitarbeiterin-sales-und-verrechnung",
  "/jobs/network-engineer-m-w-d",
  "/jobs/online-marketing-manager-m-w-d",
  "/jobs/php-developer-cloud-management-platform-m-w-d",
  "/jobs/php-developer-ndash-br-focus-on-network-automation-m-w-d",
  "/jobs/php-developer-project-development-m-w-d",
  "/jobs/project-manager-ndash-it-infrastructure-m-w-d",
  "/jobs/project-manager-software-development-m-w-d",
  "/jobs/python-developer-m-w-d",
  "/jobs/sales-expert-cloud-services-m-w-d",
  "/jobs/senior-net-developer-m-w-d",
  "/jobs/senior-network-architect-m-w-d",
  "/jobs/senior-php-developer-cloud-management-platform-m-w-d",
  "/jobs/senior-software-quality-engineer-m-w-d",
  "/jobs/software-architect-cloud-services-m-w-d",
  "/jobs/software-engineer-m-w-d-ndash-br-cloud-services-go",
  "/jobs/software-engineer-m-w-d-ndash-br-cloud-services-python",
  "/jobs/software-quality-engineer-m-w-d",
  "/jobs/supportmitarbeiter-m-w-d",
  "/jobs/system-automation-engineer-m-w-d",
  "/jobs/system-automation-engineer-windows-m-w-d",
  "/jobs/system-engineer-infrastructure-m-w-d-br-schwerpunkt-backup-storage",
  "/jobs/system-und-netzwerktechniker-im-datacenter-m-w-d",
  "/jobs/team-lead-customer-service-m-w-d",
  "/jobs/test-automation-engineer-m-w-d",
  "/kontakt",
  "/kontakt/datenschutzerklaerung.php",
  "/kontakt/disclaimer.php",
  "/kontakt/impressum.php",
  "/kontakt/postanschrift.php",
  "/kontakt/telefonsupport.php",
  "/professional",
  "/professional/colocation",
  "/professional/dedizierte-server",
  "/professional/managed-server",
  "/professional/managed-server/managed-cloud-cluster.php",
  "/professional/managed-server/managed-privateserver-erweiterungen.php",
  "/professional/managed-server/managed-privateserver.php",
  "/professional/managed-server/managed-server.php",
  "/professional/softwareentwicklung",
  "/ssl-zertifikate",
  "/ssl-zertifikate/geotrust.php",
  "/ssl-zertifikate/rapid.php",
  "/ssl-zertifikate/thawte.php",
  "/static/assets/images/fotos/jobs_bilder/besprechung_large.jpg",
  "/static/assets/images/fotos/jobs_bilder/freizeit_large.jpg",
  "/static/assets/images/fotos/jobs_bilder/obst_large.jpg",
  "/support",
  "/ueber-netcup",
  "/ueber-netcup/auszeichnungen.php",
  "/ueber-netcup/ddos-schutz-filter.php",
  "/ueber-netcup/hardware-infrastruktur.php",
  "/ueber-netcup/kundenmeinungen-netcup.php",
  "/ueber-netcup/merchandising.php",
  "/ueber-netcup/oekostrom.php",
  "/ueber-netcup/partner.php",
  "/ueber-netcup/public-relations.php",
  "/ueber-netcup/rechenzentren.php",
  "/ueber-netcup/rechenzentrum.php",
  "/ueber-netcup/zahlen",
  "/vserver",
  "/vserver/reseller_angebote_vserver.php",
  "/vserver/root-server-erweiterungen.php",
  "/vserver/storagespace.php",
  "/vserver/uebersicht_vserver_angebote.php",
  "/vserver/vergleich-linux-vserver-kvm.php",
  "/vserver/vergleich-root-server-vps.php",
  "/vserver/vps.php",
  "/vserver/vserver_guenstig_qualitaet.php",
  "/vserver/vserver_images.php",
  "/vserver/vserver_restposten.php",
  "/vserver/vstorage.php"
]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    for (; ;) {
        const results = JSON.parse(fs.readFileSync('result.json'));
        
        for (let r of refs) {
            try {
                const resp = await got.post("https://www.netcup.de/api/eggs", { form: { requrl: r } })
                const egg = JSON.parse(resp.body).eggs[0]

                if (egg) {
                    let name = egg.id + "__" + egg.title + ".txt"
                    name = name.replace(/[\/|\\:*?"<>]/g, "_")
                    const url = `https://www.netcup.de/bestellen/produkt.php?produkt=${egg.product_id}&hiddenkey=${egg.product_key}`
                    fs.writeFileSync(name, `https://www.netcup.de/bestellen/produkt.php?produkt=${egg.product_id}&hiddenkey=${egg.product_key}\n${JSON.stringify(egg)}\n${r}`)

                    const isSaved = results.find(r => r.id === egg.id)

                    if (!isSaved) {
                        console.log(egg)
                        await bot.telegram.sendMessage("@netcup_easter_egg", `${he.decode(egg.title)} / ${he.decode(egg.price)} / ${he.decode(egg.price_text)}\n${url}`, { parse_mode: 'Markdown'})
                        results.push(egg)
                    };
                }
            } catch (error) {
                console.error(error)
            }

        }
        fs.writeFileSync('result.json', JSON.stringify(results))
        await sleep(60000)
    }
}

main()