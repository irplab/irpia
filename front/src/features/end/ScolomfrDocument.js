import React, {useEffect, useMemo, useState} from "react";
import {Box, Breadcrumbs, Grid, Link, List, ListItem, Stack, styled, Typography, useTheme} from "@mui/material";
import Image from "mui-image";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {capitalizeFirstLetter} from "../../commons/utils";

const ScolomfrDocument = ({
                              printMode,
                              notice,
                              contributors,
                              reference,
                              base64Type,
                              base64Image,
                              levelValues,
                              domainValues
                          }) => {
    const theme = useTheme();
    const [hoveredKey, setHoveredKey] = useState(undefined)
    const [contributorsByRole, setContributorsByRole] = useState({})
    const [roleLabels, setRoleLabels] = useState({})

    useEffect(() => {
        let rl = {};
        let cr = {};
        for (const index in contributors) {
            const contributor = contributors[index];
            const roleKey = contributor['contributorRole'];
            const roleLabel = contributor['contributorRoleLabel'];
            const roleList = cr[roleKey] || [];
            roleList.push(contributor)
            cr = {...cr, [roleKey]: roleList}
            rl = {...rl, [roleKey]: roleLabel}
        }
        setContributorsByRole(cr)
        setRoleLabels(rl)
    }, [contributors])

    function getBreadCrumbs(valuesList, valuesField) {
        return <List sx={{listStyle: 'none', pt: 0}}>{valuesList.map((values, index1) => {
            return <ListItem
                sx={{'&::before': {content: '"•"', color: "black"}}}> < Breadcrumbs separator="›"
                                                                                    maxItems={printMode ? 4 : 2}
                                                                                    aria-label="breadcrumb">
                {
                    values.map((value, index2) => {
                        let entryKey = `${valuesField}-${index1}-${index2}`;
                        return <Typography
                            pl={3}
                            onMouseEnter={() => setHoveredKey(entryKey)}
                            onMouseLeave={() => setHoveredKey(null)}
                            component='p'>{value.label}
                            <Link underline="hover" target="_blank"
                                  key={entryKey}
                                  href={value.uri}><OpenInNewIcon
                                fontSize='small'
                                sx={{
                                    verticalAlign: 'middle',
                                    visibility: printMode || (hoveredKey === entryKey) ? 'visible' : 'hidden'
                                }}/></Link></Typography>;
                    })
                } </Breadcrumbs>
            </ListItem>
        })
        }</List>;
    }

    const domainValuesBreadcrumbs = useMemo(() => {
            return getBreadCrumbs(domainValues, 'domain')
        },
        [domainValues, hoveredKey, getBreadCrumbs]
    )

    const levelValuesBreadcrumbs = useMemo(() => {
            return getBreadCrumbs(levelValues, 'level')
        },
        [levelValues, hoveredKey, getBreadCrumbs]
    )

    const contributorTag = styled(Typography)(({theme}) => ({
        fontSize: 'small',
        lineHeight: printMode ? 1 : 2,
        padding: theme.spacing(0.5),
        backgroundColor: theme.palette.info.hyperlight
    }));

    const contributorValue = styled(Typography)(({theme}) => ({
        fontSize: 'small',
        padding: theme.spacing(1),
        ml: theme.spacing(1),
    }));

    return (
        <Box component="div" id="print-wrapper"
             sx={{overflowY: printMode ? 'scroll' : 'initial'}}>
            <Grid container direction="column" spacing={2} id={printMode ? "notice-print" : "notice-display"}
                  sx={{
                      display: printMode ? "none" : "block",
                      padding: printMode ? '10px' : '0'
                  }}
                  ref={reference}>
                <Grid item>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={3}><Image showLoading={false}
                                                 src={`data:${base64Type};base64,${base64Image}`}/></Grid>
                        <Grid item md={9}>
                            <Grid container direction="column">
                                <Grid item md={12}>
                                    <Typography component="h3" mt={printMode ? 3 : 0}
                                                variant="h6">{capitalizeFirstLetter(notice.educationalResourceTypeLabel.join(", "))}</Typography>
                                    <Typography component="h2" color="primary" variant="h4"
                                                mt={printMode ? 3 : 1}>{notice.title}</Typography>
                                    <Link underline="hover" target="_blank" href={notice.url}><Typography
                                        mt={printMode ? 3 : 3} fontSize="large">{notice.url}</Typography></Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={2}
                      sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText
                      }}><Typography component="h3"
                                     variant="h5">Présentation</Typography></Grid>
                <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={2}
                      sx={{
                          color: theme.palette.secondary.light
                      }}><Typography component="h4"
                                     variant="h6">Informations
                    pratiques</Typography></Grid>
                {notice.educationalResourceTypeLabel &&
                    <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={2}>
                        <Grid container direction="row" mt={0}>

                            <Grid item component={Box} md={2} xs={12}>
                                <Typography fullWidth component="p" sx={{
                                    p: theme.spacing(1),
                                    display: 'inline',
                                    backgroundColor: theme.palette.info.hyperlight
                                }}>Type</Typography>
                            </Grid>
                            <Grid item component={Box} md={10} xs={12}>
                                <Typography component="p"
                                            variant="p">{capitalizeFirstLetter(notice.educationalResourceTypeLabel.join(", "))}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>}
                {notice.educationalResourceTypeLabel &&
                    <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={0}>
                        <Grid container direction="row" mt={0}>

                            <Grid item component={Box} md={2} xs={12}>
                                <Typography fullWidth component="p" sx={{
                                    p: theme.spacing(1),
                                    display: 'inline',
                                    backgroundColor: theme.palette.info.hyperlight
                                }}>Contenu</Typography>
                            </Grid>
                            <Grid item component={Box} md={10} xs={12}>
                                <Typography component="p"
                                            variant="p">{capitalizeFirstLetter(notice.documentTypeLabel.join(", "))}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>}
                <Grid component={"div"} item width="100%" m={0} py={0} mt={2}
                      sx={{
                          padding: 0,
                          color: theme.palette.secondary.light
                      }}><Typography component="h4" py={0}
                                     variant="h6">Description de la ressource</Typography></Grid>
                {notice.description &&
                    <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={0}>
                        <Typography fullWidth component="p" sx={{
                            p: theme.spacing(1),
                        }}>{notice.description}</Typography>

                    </Grid>}
                <Grid component={"div"} item width="100%" m={0} py={0} mt={2}
                      sx={{
                          padding: 0,
                          color: theme.palette.secondary.light
                      }}><Typography component="h4" py={0}
                                     variant="h6">Mots clés</Typography></Grid>
                {notice.keywords.length > 0 &&
                    <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={0}>
                        <Typography fullWidth component="p" sx={{
                            p: theme.spacing(1),
                        }}>{notice.keywords.join(', ')}</Typography>

                    </Grid>}
                {domainValues &&
                    <Grid component={Box} item className="no-break"><Grid component={"div"} item width="100%" m={0}
                                                                          py={0} mt={2}
                                                                          sx={{
                                                                              padding: 0,
                                                                              color: theme.palette.secondary.light
                                                                          }}><Typography component="h4" py={0}
                                                                                         variant="h6">Domaines
                        d'enseignement</Typography></Grid>
                        <Grid component={"div"} item width="100%" m={0} py={0} mt={2}
                              sx={{
                                  mt: 0,
                                  padding: 0,
                                  color: theme.palette.secondary.light
                              }}>
                            {domainValuesBreadcrumbs}
                        </Grid>
                    </Grid>
                }

                {levelValues &&
                    <Grid component={Box} item className="no-break"><Grid component={"div"} item width="100%" m={0}
                                                                          py={0} mt={2}
                                                                          sx={{
                                                                              padding: 0,
                                                                              color: theme.palette.secondary.light
                                                                          }}><Typography component="h4" py={0}
                                                                                         variant="h6">Niveau(x)
                        éducatif(s)</Typography></Grid>
                        <Grid component={"div"} item width="100%" m={0} py={0} mt={2}
                              sx={{
                                  mt: 0,
                                  padding: 0,
                                  color: theme.palette.secondary.light
                              }}>
                            {levelValuesBreadcrumbs}
                        </Grid>
                    </Grid>
                }
                <Grid component={Box} item className="no-break">
                    <Grid component={Box} item width="100%" pt={theme.spacing(1)} mt={theme.spacing(2)}
                          pb={theme.spacing(1)}
                          sx={{
                              paddingX: theme.spacing(1),
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText
                          }}><Typography component="h3"
                                         variant="h5">Contributions</Typography></Grid>
                    {contributors && <Stack spacing={2}>
                        {Object.keys(roleLabels).map((index) => {
                            return <><Box className="no-break"><Typography component="h4" py={0}
                                                                           mt={2}
                                                                           sx={{
                                                                               padding: 0,
                                                                               color: theme.palette.secondary.light
                                                                           }}
                                                                           variant="h6">{capitalizeFirstLetter(roleLabels[index])}</Typography></Box>
                                {(contributorsByRole[index] || []).map((contributor) => {
                                    return <Grid container direction='row' gap={printMode ? null : "10px 0px"}>
                                        <Grid item
                                              component={contributorValue}
                                              sx={{fontWeight: 'bold'}}> {contributor.contributorName}</Grid>

                                        {(contributor.editorialBrand && contributor.editorialBrand !== contributor.contributorName) &&
                                            <div style={{display: "flex", marginRight: theme.spacing(1)}}>
                                                <Grid item component={contributorTag}>Marque éditoriale</Grid>
                                                <Grid item
                                                      component={contributorValue}>{contributor.editorialBrand}</Grid>

                                            </div>}
                                        {(contributor.selectedIsniInfo?.identifier || contributor.customIsni) &&
                                            <div style={{display: "flex", marginRight: theme.spacing(1)}}>
                                                <Grid item component={contributorTag}>ISNI</Grid><Grid item
                                                                                                       component={contributorValue}>{contributor.selectedIsniInfo?.identifier || contributor.customIsni}</Grid>

                                            </div>}
                                        {(contributor.selectedSirenInfo?.identifier || contributor.customSiren) &&
                                            <div style={{display: "flex", marginRight: theme.spacing(1)}}>
                                                <Grid item component={contributorTag}>SIREN</Grid><Grid item
                                                                                                        component={contributorValue}>{contributor.selectedSirenInfo?.identifier || contributor.customSiren}</Grid>

                                            </div>}
                                        {(contributor.contributorPhoneNumber) &&
                                            <div style={{display: "flex", marginRight: theme.spacing(1)}}>
                                                <Grid item component={contributorTag}>Téléphone</Grid><Grid item
                                                                                                            component={contributorValue}>{contributor.contributorPhoneNumber}</Grid>

                                            </div>}
                                    </Grid>
                                })
                                }
                            </>

                        })}
                    </Stack>}
                </Grid>
            </Grid>

        </Box>
    )
};

export default ScolomfrDocument;