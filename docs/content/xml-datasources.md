---
outline: deep
---

# Data Sources

The Data Sources section is required in the Visualization XML to inform Galaxy of the compatible data types for your visualization.
If your visualization does not need a pre-existing dataset, set `required="false"` on the `<param>` definition.

```xml
<data_sources>
    <data_source>
        <model_class>HistoryDatasetAssociation</model_class>
        <test test_attr="ext">{{ COMPATIBLE_EXTENSION }}</test>
    </data_source>
</data_sources>
<params>
    <param required="true">dataset_id</param>
</params>
```


## Tests

You may also add a `<tests>` section which allows you to define **test cases** for your visualization. These help ensure that the plugin works correctly when given specific inputs. Each test can specify a URL to a file and its corresponding Galaxy datatype type (`ftype`). Users will be able to upload the dataset and invoke the visualization.

```xml
<tests>
    <test>
        <param name="dataset_id" value="http://cdn.jsdelivr.net/gh/galaxyproject/galaxy-test-data/1.{{ COMPATIBLE_EXTENSION }}" ftype="{{ COMPATIBLE_EXTENSION }}" />
    </test>
</tests>
```

You can use any public URL pointing to test data, ideally from a maintained repository such as `galaxy-test-data`.

## Available Extensions

Galaxy supports a variety of datatype extensions:
<span v-for="(dt, index) of DATATYPES" class="font-italic">
    <span>`{{ dt }}`</span>
    <span v-if="index === DATATYPES.length - 1">.</span>
    <span v-else>,</span>
</span>

For more information on datatypes please refer to the Galaxy Documentation at: https://docs.galaxyproject.org/en/master/dev/data_types.html.

<script setup>
const DATATYPES = ["4dn_pairs","4dn_pairsam","a3m","ab1","affybatch","agilentbrukeryep.d.tar","agilentmasshunter.d.tar","agp","ampvis2","analyze75","arff","asn1","asn1-binary","augustus","avi","axt","bam","bcf","bcf_uncompressed","bcsl.model","bcsl.ts","bed","bed12","bed6","bed_tabix.gz","bedgraph","bedstrict","bgzip","bigbed","bigwig","bil","biom1","biom2","blastxml","blib","bref3","brukerbaf.d.tar","brukertdf.d.tar","bus","castep","cel","cell","chain","chira.sqlite","chrint","cif","cisml","ckpt","cmap","cml","cnn","cnr","cns","colab.tar","colab.tar.gz","consensusxml","cool","cps","cpt","cram","csfasta","csv","ct","ctl.result","cuffdiff.sqlite","cxb","d3_hierarchy","daa","dada2_dada","dada2_errorrates","dada2_mergepairs","dada2_sequencetable","dada2_uniques","dbn","dbnsfp.tabular","dcd","deeptools_compute_matrix_archive","deeptools_coverage_matrix","den_fmt","dlib","drf","dta","dta2d","dzi","edr","edta","eland","elandmulti","elib","embl","encodepeak","eset","excel.xls","expression.json","extxyz","fai","fast5.tar","fast5.tar.bz2","fast5.tar.gz","fast5.tar.xz","fasta","fasta.gz","fastg","fastk_hist","fastk_ktab","fastk_prof","fastq","fastq.bz2","fastq.gz","fastqcssanger","fastqcssanger.bz2","fastqcssanger.gz","fastqillumina","fastqillumina.bz2","fastqillumina.gz","fastqsanger","fastqsanger.bz2","fastqsanger.gz","fastqsolexa","fastqsolexa.bz2","fastqsolexa.gz","fcs","featurexml","ffdata","ffindex","fits","flowclr","flowframe","flowmfi","flowscore","flowset","flowstat1","flowstat2","flowstat3","flowtext","flv","fped","fphe","fps","fqtoc","fsom","gafa.sqlite","gal","gatk_dbsnp","gatk_interval","gatk_recal","gatk_report","gatk_tranche","gemini.sqlite","genbank","genbank.gz","genenotebook","geojson","gfa1","gfa1.gz","gfa2","gfa2.gz","gff","gff3","gff3.bz2","gff3.gz","gff_tabix.gz","gii","gii.gz","gmsh.geo","gmsh.msh","gpr","grd","grd.tgz","grib","gro","gtf","h5","h5ad","h5mlm","hdf4","hdr","hdt","hep.root","hexrd.accepted_orientations","hexrd.eta_ome.npz","hexrd.images.npz","hexrd.materials.h5","hexrd.scored_orientations.npz","hexrd.yml","hhr","hlf","hmm2","hmm3","icm","idat","ideaspre","idpdb","idxml","imgt.json","imzml","inchi","inp","inpcrd","intermine_tabular","interval","ipynb","isa-json","isa-tab","itp","jellyfish","jp2","json","jsonld","juicer_medium_tabix.gz","kallisto.idx","kroenik","lav","ldindep","len","loom","lped","ludwig_model","maf","magres","malist","mascotxml","maskinfo-asn1","maskinfo-asn1-binary","mcool","mdp","memepsp","memexml","meryldb","metacyto_clr.txt","metacyto_stats.txt","metacyto_summary.txt","mgf","mkv","mol","mol2","mongodb","mothur.accnos","mothur.align","mothur.align.check","mothur.align.report","mothur.axes","mothur.cons.taxonomy","mothur.count_table","mothur.design","mothur.dist","mothur.filter","mothur.filtered.masked.quan","mothur.filtered.quan","mothur.freq","mothur.groups","mothur.list","mothur.lower.dist","mothur.map","mothur.masked.quan","mothur.names","mothur.oligos","mothur.otu","mothur.otu.corr","mothur.otulabels","mothur.pair.dist","mothur.quan","mothur.rabund","mothur.rdp.taxonomy","mothur.ref.taxonomy","mothur.relabund","mothur.sabund","mothur.seq.taxonomy","mothur.sff.flow","mothur.shared","mothur.square.dist","mothur.summary","mothur.tax.summary","mothur.tre","mov","mp3","mp4","mpg","mrc","mrm","ms2","msh","msp","mtx","mz.sqlite","mz5","mzdata","mzid","mzml","mzq","mzqc","mztab","mztab2","mzxml","n3","ncbi_genome_dataset.zip","ncbitaxonomy.sqlite","ndx","neostore.zip","neper.mscell","neper.points","neper.points.tsv","neper.tesr","neper.tess","netcdf","newick","nex","nhx","nii1","nii1.gz","nii2","nii2.gz","nmrml","npy","npz","nt","obfs","obo","odgi","ogg","ome.tiff","onnx","osw","owl","oxlicg","oxligl","oxling","oxliss","oxlist","oxlits","paf","paf.gz","par","param","paramxml","parquet","pbed","pdb","pdbqt","pdf","peff","peplist","peptideshaker_archive","pepxml","pepxml.tsv","phar","phylip","phyloseq","phyloxml","picard_interval_list","pileup","pithya.model","pithya.property","pithya.result","plyascii","plybinary","png","pod5","postgresql","pov","pphe","pqp","pqr","pretext","prj","prmtop","probam","probed","protobuf2","protobuf3","protxml","protxml.tsv","psl","psms","pssm-asn1","ptkscmp","qcml","qiime2.tabular","qname_sorted.bam","qual454","qualillumina","qualsolexa","qualsolid","qza","qzv","rdata","rdata.camera.negative","rdata.camera.positive","rdata.camera.quick","rdata.msnbase.raw","rdata.sce","rdata.se","rdata.xcms.fillpeaks","rdata.xcms.findchrompeaks","rdata.xcms.group","rdata.xcms.raw","rdata.xcms.retcor","rdf","rdock_as","rds","rma6","rna_eps","sam","sbml","sbol","scf","scidx","scool","sdf","searchgui_archive","sf3","sff","shp","sif","smat","smi","snaphmm","snpeffdb","snpmatrix","snpsiftdbnsfp","snptest","source.c","source.cpp","source.cs","source.go","source.h","source.py","source.rs","spalndba","spalndbnp","spec.xml","splib","splib_noindex","sqlite","sqmass","sra","sra_manifest.tabular","star","stl","stockholm","storm.check","storm.sample","tabular","tabular.gz","tandem","tar","taxonomy","tck","textgrid","tgz","thermo.raw","tiff","toml","top","tpr","trackhub","trafoxml","traml","trk","trr","tsv","ttl","twobit","txt","ucsc.net","uniprotxml","unsorted.bam","vcf","vcf_bgzip","vel","velvet","vg","visium.tar.gz","vtkascii","vtkbinary","watersmasslynx.raw.tar","wav","webm","wiff","wiff.tar","wiff2","wiff2.tar","wig","wma","wmv","xg","xgmml","xlsx","xmfa","xml","xquest.xml","xsd","xtc","xvg","xyz","yaml","zip","zset.geof"];

</script>